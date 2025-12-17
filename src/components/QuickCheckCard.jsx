import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import "./QuickCheckCard.css";
import { supabase } from "../lib/supabaseClient";
import CheckListItem from "./CheckListItem";
import PhotoPromptModal from "./PhotoPromptModal";

const QuickCheckCard = forwardRef(function QuickCheckCard(
  { onAlertChange, session },
  ref
) {
  const [items, setItems] = useState([]);
  const [photoPrompt, setPhotoPrompt] = useState({ open: false, item: null });

  useEffect(() => {
    async function fetchItems() {
      if (!session?.user?.id) return;
      const { data, error } = await supabase
        .from("devices")
        .select("id,name,room,icon,color,enabled,account_id")
        .eq("account_id", session.user.id);
      if (!error && data) {
        setItems(
          data.map((d) => ({
            id: d.id,
            device: d.name,
            room: d.room,
            checked: !!d.enabled,
            icon: d.icon,
            color: d.color,
          }))
        );
      }
    }
    fetchItems();
  }, [session]);

  useEffect(() => {
    const allChecked = items.every((item) => item.checked);
    if (onAlertChange) onAlertChange(!allChecked);
  }, [items, onAlertChange]);

  useImperativeHandle(ref, () => ({
    checkAll: (value) => {
      setItems((prevItems) => {
        const updated = prevItems.map((item) => ({ ...item, checked: value }));
        // Update all in Supabase
        const ids = updated.map((item) => item.id);
        supabase.from("devices").update({ enabled: value }).in("id", ids);
        return updated;
      });
    },
  }));

  const toggleItem = async (id) => {
    const item = items.find((i) => i.id === id);
    const nextEnabled = !(item?.checked ?? false);
    // Show photo prompt only when checking (turning on)
    if (!item.checked) {
      setPhotoPrompt({ open: true, item });
      // Don't update state or supabase until photo/skip
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
    await supabase
      .from("devices")
      .update({ enabled: nextEnabled })
      .eq("id", id);
  };

  // Called after photo/skip
  const confirmCheck = async (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, checked: true } : item
      )
    );
    await supabase.from("devices").update({ enabled: true }).eq("id", id);
  };

  const handlePhoto = async (file) => {
    if (!photoPrompt.item) return;
    const deviceId = photoPrompt.item.id;
    // Upload to Supabase Storage
    const filePath = `${deviceId}/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from("device-proof-photos")
      .upload(filePath, file, { upsert: true });
    if (error) {
      alert("Photo upload failed");
      setPhotoPrompt({ open: false, item: null });
      return;
    }
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("device-proof-photos")
      .getPublicUrl(filePath);
    const photoUrl = publicUrlData.publicUrl;
    // Save URL to the device row
    await supabase
      .from("devices")
      .update({ photo_url: photoUrl, enabled: true })
      .eq("id", deviceId);
    // Update local state
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === deviceId
          ? { ...item, checked: true, photo_url: photoUrl }
          : item
      )
    );
    setPhotoPrompt({ open: false, item: null });
  };
  const handleSkip = () => setPhotoPrompt({ open: false, item: null });

  const checkedCount = items.filter((item) => item.checked).length;
  const totalCount = items.length;

  return (
    <div className="qccard-root">
      <h2 className="qccard-title">Quick Check</h2>
      <div className="qccard-list">
        {items.map((item) => (
          <CheckListItem key={item.id} item={item} onToggle={toggleItem} />
        ))}
      </div>
      <div className="qccard-progress">
        {checkedCount} / {totalCount} checked
      </div>
      <PhotoPromptModal
        open={photoPrompt.open}
        deviceName={photoPrompt.item?.device}
        onClose={() => setPhotoPrompt({ open: false, item: null })}
        onPhoto={() => {
          if (photoPrompt.item) confirmCheck(photoPrompt.item.id);
          setPhotoPrompt({ open: false, item: null });
        }}
        onSkip={() => {
          if (photoPrompt.item) confirmCheck(photoPrompt.item.id);
          setPhotoPrompt({ open: false, item: null });
        }}
      />
    </div>
  );
});

export default QuickCheckCard;
