import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import DeviceCard from "../components/DeviceCard";
import "./Devices.css";
import Button from "../UI/Button";
import IconPlus from "../assets/icons/plus.svg?react";
import AddDeviceModal from "../components/AddDeviceModal";
import { WaitingMascot } from "../components/WaitingMascot";

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  async function fetchDevices(userId) {
    setLoading(true);
    if (!userId) {
      setDevices([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("devices")
      .select("id,name,color,icon,room,enabled,reminder_time,account_id")
      .eq("account_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch devices:", error);
      setDevices([]);
    } else {
      setDevices(
        (data ?? []).map((d) => ({
          id: d.id,
          name: d.name,
          color: d.color,
          icon: d.icon,
          room: d.room,
          enabled: d.enabled,
          reminderTime: d.reminder_time,
        }))
      );
    }
    setLoading(false);
  }

  useEffect(() => {
    if (session?.user?.id) {
      fetchDevices(session.user.id);
    }
  }, [session]);

  async function handleToggle(id) {
    // optimistic UI: flip locally first
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, enabled: !d.enabled } : d))
    );

    const current = devices.find((d) => d.id === id);
    const nextEnabled = !(current?.enabled ?? false);

    const { error } = await supabase
      .from("devices")
      .update({ enabled: nextEnabled })
      .eq("id", id);

    if (error) {
      console.error("Failed to toggle device:", error);
      // revert if it failed
      setDevices((prev) =>
        prev.map((d) => (d.id === id ? { ...d, enabled: !d.enabled } : d))
      );
    }
  }

  function handleEdit(device) {
    // Later: open an EditDeviceModal and update Supabase.
    alert(`Edit ${device.name}`);
  }

  async function handleDelete(id) {
    // optimistic remove
    const before = devices;
    setDevices((prev) => prev.filter((d) => d.id !== id));

    const { error } = await supabase.from("devices").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete device:", error);
      setDevices(before);
    }
  }

  async function handleAdd(newDevice) {
    if (!session?.user?.id) {
      console.error("No user session, cannot add device");
      return;
    }
    const payload = {
      name: newDevice.name,
      room: newDevice.room,
      icon: newDevice.icon,
      color: newDevice.color,
      enabled: newDevice.enabled ?? false,
      reminder_time: newDevice.reminderTime ?? null,
      account_id: session.user.id,
    };

    const { data, error } = await supabase
      .from("devices")
      .insert(payload)
      .select("id,name,color,icon,room,enabled,reminder_time,account_id")
      .single();

    if (error) {
      console.error("Failed to add device:", error);
      return;
    }

    const inserted = {
      id: data.id,
      name: data.name,
      color: data.color,
      icon: data.icon,
      room: data.room,
      enabled: data.enabled,
      reminderTime: data.reminder_time,
    };

    setDevices((prev) => [inserted, ...prev]);
  }

  return (
    <div className="devices-page">
      <section className="top-section">
        <h2>My Devices</h2>
        <h5>Manage your safety reminders.</h5>
      </section>

      <Button
        variant="primary"
        onClick={() => setIsModalOpen(true)}
        icon={<IconPlus />}
        style={{ height: "55px" }}
      >
        Add new device
      </Button>

      <AddDeviceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAdd}
      />

      <div className="devices-container">
        <section className="devices-list">
          {loading ? (
            <p className="devices-loading">Loading devices...</p>
          ) : devices.length === 0 ? (
            <div className="devices-empty">
              <WaitingMascot />
              <h4 style={{ textAlign: "center", marginTop: 8 }}>
                Keep your home safe - add devices to monitor!
              </h4>
            </div>
          ) : (
            devices.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </section>
      </div>
    </div>
  );
}
