"use client";

import { useState, useEffect } from "react";
import { Loader2, Upload, Plus, Tag, X, Trash2 } from "lucide-react";
import { tagService } from "@/services/tag.services";
import toast from "react-hot-toast";

export default function EventsForm({ initialData, onSubmit, loading }) {
  // 🟦 Khởi tạo form cơ bản
  const [form, setForm] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    location: initialData?.location || "",
    isSpecialEvent: initialData?.isSpecialEvent || false,
    startDateLocal: initialData?.startDate
      ? new Date(initialData.startDate).toISOString().slice(0, 16)
      : "",
    endDateLocal: initialData?.endDate
      ? new Date(initialData.endDate).toISOString().slice(0, 16)
      : "",
  });

  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState(
    initialData?.tags?.map((t) => t.id) || []
  );

  // 🟦 Xử lý media cũ và mới
  const [existingMedia, setExistingMedia] = useState(
    initialData?.mediaUrls || []
  );
  const [files, setFiles] = useState([]);

  // 🟦 Xử lý link bị stringify nhiều lớp
  const [links, setLinks] = useState(() => {
    if (!initialData?.links) return [""];
    let raw = initialData.links;
    if (typeof raw[0] === "string" && raw[0].startsWith("[")) {
      try {
        const first = JSON.parse(raw[0]);
        if (Array.isArray(first)) return first;
        if (typeof first === "string" && first.startsWith("[")) {
          const second = JSON.parse(first);
          if (Array.isArray(second)) return second;
        }
      } catch {
        return [raw[0]];
      }
    }
    return raw;
  });

  const [showTagModal, setShowTagModal] = useState(false);
  const [newTag, setNewTag] = useState("");

  // 🟦 Lấy danh sách tag từ BE
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await tagService.getAll();
        setTags(data);
      } catch {
        toast.error("Failed to load tags");
      }
    };
    fetchTags();
  }, []);

  // 🟦 Hàm helpers
  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleTagToggle = (id) =>
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleFileChange = (e) =>
    setFiles((prev) => [...prev, ...Array.from(e.target.files)]);

  const handleRemoveExisting = (url) =>
    setExistingMedia((prev) => prev.filter((m) => m !== url));

  const handleRemoveNewFile = (index) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  const handleCreateTag = async () => {
    if (!newTag.trim()) return toast.error("Tag name cannot be empty!");
    try {
      const tag = await tagService.create(newTag.trim());
      setTags((prev) => [...prev, tag]);
      setSelectedTags((prev) => [...prev, tag.id]);
      toast.success(`Tag "${tag.name}" added`);
      setNewTag("");
      setShowTagModal(false);
    } catch {
      toast.error("Failed to create tag");
    }
  };

  const handleLinkChange = (index, value) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const addLinkField = () => setLinks((prev) => [...prev, ""]);
  const removeLinkField = (i) =>
    setLinks((prev) => prev.filter((_, idx) => idx !== i));

  const localInputToISO = (local) =>
    local ? new Date(local).toISOString() : null;

  // 🟦 Submit: gửi đúng format BE hiểu
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.startDateLocal)
      return toast.error("Please fill all required fields!");

    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("location", form.location);
    formData.append("isSpecialEvent", String(form.isSpecialEvent || false));
    formData.append("startDate", localInputToISO(form.startDateLocal));
    if (form.endDateLocal)
      formData.append("endDate", localInputToISO(form.endDateLocal));

    // ✅ tagIds
    selectedTags.forEach((id) => formData.append("tagIds", id));

    // ✅ links
    links
      .map((l) => l.trim())
      .filter(Boolean)
      .forEach((link) => formData.append("links", link));

    // ✅ mediaUrls
    existingMedia.forEach((url) => formData.append("mediaUrls", url));
    files.forEach((f) => formData.append("media", f));

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6 transition-all duration-300"
    >
      {/* 🟩 Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          {initialData ? "Edit Event" : "Create New Event"}
        </h1>
        <p className="text-sm text-zinc-400 mt-2">
          {initialData
            ? "Update existing event details."
            : "Fill in the details below to create a new event."}
        </p>
      </div>

      {/* 🟩 Title */}
      <div>
        <label className="block text-sm mb-1 text-zinc-300">Title *</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white focus:ring-2 focus:ring-cyan-400"
          placeholder="Enter event title"
        />
      </div>

      {/* 🟩 Description */}
      <div>
        <label className="block text-sm mb-1 text-zinc-300">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white focus:ring-2 focus:ring-cyan-400 placeholder-zinc-500"
          placeholder="Short event description..."
        />
      </div>

      {/* 🟩 Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1 text-zinc-300">Start Date *</label>
          <input
            name="startDateLocal"
            type="datetime-local"
            value={form.startDateLocal}
            onChange={handleChange}
            required
            className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white focus:ring-2 focus:ring-cyan-400"
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-zinc-300">End Date</label>
          <input
            name="endDateLocal"
            type="datetime-local"
            value={form.endDateLocal}
            onChange={handleChange}
            className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white focus:ring-2 focus:ring-cyan-400"
          />
        </div>
      </div>

      {/* 🟩 Location */}
      <div>
        <label className="block text-sm mb-1 text-zinc-300">Location</label>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Event location..."
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white focus:ring-2 focus:ring-cyan-400 placeholder-zinc-500"
        />
      </div>

      {/* 🟩 Links */}
      <div>
        <label className="block text-sm mb-2 text-zinc-300">Links</label>
        {links.map((link, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input
              type="url"
              value={link}
              onChange={(e) => handleLinkChange(i, e.target.value)}
              placeholder="Enter a link (e.g. https://youtube.com/...)"
              className="flex-1 rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white focus:ring-2 focus:ring-cyan-400"
            />
            <button
              type="button"
              onClick={() => removeLinkField(i)}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addLinkField}
          className="text-cyan-400 hover:underline text-sm flex items-center gap-1"
        >
          <Plus className="w-3 h-3" /> Add Link
        </button>
      </div>

      {/* 🟩 Tags */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm text-zinc-300">Tags</label>
          <button
            type="button"
            onClick={() => setShowTagModal(true)}
            className="text-cyan-400 hover:underline text-sm flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> New Tag
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              type="button"
              key={tag.id}
              onClick={() => handleTagToggle(tag.id)}
              className={`flex items-center gap-1 px-3 py-1 rounded-full border transition-all duration-200 ${
                selectedTags.includes(tag.id)
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 border-cyan-400 text-white"
                  : "bg-white/10 border-white/20 text-zinc-300 hover:border-white/40"
              }`}
            >
              <Tag className="w-3 h-3" />
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      {/* 🟩 Media */}
      <div>
        <label className="block text-sm mb-1 text-zinc-300">Media</label>

        {existingMedia.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-3">
            {existingMedia.map((url, i) => (
              <div key={i} className="relative">
                <img
                  src={url}
                  alt="existing"
                  className="rounded-lg object-cover w-full h-28"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExisting(url)}
                  className="absolute top-1 right-1 bg-black/60 rounded-full p-1 hover:bg-red-500 transition"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          <label className="cursor-pointer bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 transition text-white rounded-lg px-4 py-2 flex items-center gap-2 shadow-md">
            <Upload className="w-4 h-4" />
            Upload
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          <span className="text-sm text-zinc-400">
            {files.length > 0
              ? `${files.length} new file(s)`
              : "No new file selected"}
          </span>
        </div>

        {files.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-3">
            {files.map((f, i) => (
              <div key={i} className="relative">
                <img
                  src={URL.createObjectURL(f)}
                  alt="preview"
                  className="rounded-lg object-cover w-full h-28"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveNewFile(i)}
                  className="absolute top-1 right-1 bg-black/60 rounded-full p-1 hover:bg-red-500 transition"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🟩 Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-lg py-2 transition disabled:opacity-50 shadow-lg"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin w-4 h-4" /> Saving...
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />{" "}
            {initialData ? "Update Event" : "Create Event"}
          </>
        )}
      </button>

      {/* 🟩 Modal Create Tag */}
      {showTagModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 w-[90%] max-w-sm space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Create Tag</h2>
              <button
                type="button"
                onClick={() => setShowTagModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Enter tag name"
              className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white focus:ring-2 focus:ring-cyan-400"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowTagModal(false)}
                className="px-3 py-1.5 text-sm rounded-lg bg-white/10 hover:bg-white/20 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateTag}
                className="px-3 py-1.5 text-sm rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
