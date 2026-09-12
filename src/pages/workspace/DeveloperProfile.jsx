import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import { useEffect, useRef, useState } from "react";
import { getUserById, updateUser } from "../../api/userApi";
import {
  deleteProfileImage,
  getProfileImage,
  uploadProfileImage,
} from "../../api/userProfileApi";
import { useAuth } from "../../context/AuthContext";
export default function Profile() {
  const { user } = useAuth();
  const id = user?.userId ?? user?.id;
  const [profile, setProfile] = useState(user || {}),
    [image, setImage] = useState(""),
    [name, setName] = useState(user?.name || ""),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");
  const input = useRef(null);
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const p = await getUserById(id);
        setProfile(p);
        setName(p.name || "");
        if (p.hasProfileImage) {
          try {
            setImage(await getProfileImage(id));
          } catch {
            // No profile image set — keep the default avatar.
          }
        }
      } catch (e) {
        setError(e.response?.data?.message || "Failed to load profile");
      }
    })();
    return () => {
      if (image) URL.revokeObjectURL(image);
    };
  }, [id]);
  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setError("");
      const p = await uploadProfileImage(id, file);
      setProfile(p);
      if (image) URL.revokeObjectURL(image);
      setImage(await getProfileImage(id));
      setMessage("Profile image updated");
    } catch (e) {
      setError(
        e.response?.data?.message || e.message || "Failed to upload image",
      );
    }
    e.target.value = "";
  };
  const remove = async () => {
    try {
      await deleteProfileImage(id);
      if (image) URL.revokeObjectURL(image);
      setImage("");
      setProfile({ ...profile, hasProfileImage: false });
      setMessage("Profile image removed");
    } catch (e) {
      setError(e.response?.data?.message || "Failed to remove image");
    }
  };
  const save = async () => {
    try {
      const p = await updateUser(id, { name });
      setProfile(p);
      setMessage("Profile updated successfully");
    } catch (e) {
      setError(
        e.response?.data?.message || e.message || "Failed to update profile",
      );
    }
  };
  const displayName = name || profile.name || "Team Member";
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: 28, fontWeight: 800 }}>Profile</Typography>
        <Typography sx={{ mt: 0.5, color: "text.secondary", fontSize: 14 }}>
          Manage your profile image and account information.
        </Typography>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}
      <Card elevation={0} sx={{ border: "1px solid #dfe1e6", maxWidth: 900 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={image || undefined}
                sx={{ width: 88, height: 88, fontSize: 30, fontWeight: 700 }}
              >
                {displayName.charAt(0).toUpperCase()}
              </Avatar>
              <IconButton
                size="small"
                onClick={() => input.current?.click()}
                sx={{
                  position: "absolute",
                  right: -8,
                  bottom: -4,
                  bgcolor: "background.paper",
                  boxShadow: 2,
                }}
              >
                <PhotoCameraIcon fontSize="small" />
              </IconButton>
              <input
                ref={input}
                hidden
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={upload}
              />
            </Box>
            <Box>
              <Typography fontSize={20} fontWeight={700}>
                {displayName}
              </Typography>
              <Typography fontSize={13} color="text.secondary">
                {profile.email || user?.email || ""}
              </Typography>
              <Box sx={{ mt: 1 }}>
                {profile.hasProfileImage && (
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={remove}
                  >
                    Remove photo
                  </Button>
                )}
                <Typography
                  component="span"
                  sx={{ fontSize: 12, color: "text.secondary", ml: 1 }}
                >
                  JPG, PNG, WEBP or GIF · max 5 MB
                </Typography>
              </Box>
            </Box>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <TextField
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Email"
            value={profile.email || ""}
            fullWidth
            disabled
            sx={{ mt: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button variant="contained" onClick={save} disabled={!name.trim()}>
              Save Changes
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
