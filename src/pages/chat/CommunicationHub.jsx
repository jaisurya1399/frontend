import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import VideoCallRoundedIcon from "@mui/icons-material/VideoCallRounded";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { getStoredUserId } from "../../api/axios";
import {
  attachMeetingDocument,
  createProjectMeeting,
  getDirectMessages,
  getMeetingDocuments,
  getMeetingMessages,
  getProjectMeetings,
  getProjectMessages,
  removeMeetingDocument,
  sendDirectMessage,
  sendMeetingMessage,
  sendProjectMessage,
  updateMeetingStatus,
} from "../../api/chatApi";
import { createDocument } from "../../api/documentApi";
import { getActiveEpicsByProject } from "../../api/epicApi";
import { getProjects } from "../../api/projectApi";
import { getProjectUsers } from "../../api/projectUserApi";
import { getUsers } from "../../api/userApi";

const localDate = (d) => (d ? new Date(d).toLocaleString() : "");
const toIso = (value) => (value ? new Date(value).toISOString() : null);

export default function CommunicationHub() {
  const me = Number(getStoredUserId());
  const [tab, setTab] = useState(0),
    [users, setUsers] = useState([]),
    [projects, setProjects] = useState([]),
    [team, setTeam] = useState([]),
    [epics, setEpics] = useState([]);
  const [selectedUser, setSelectedUser] = useState(""),
    [projectId, setProjectId] = useState(""),
    [meetingId, setMeetingId] = useState("");
  const [messages, setMessages] = useState([]),
    [meetings, setMeetings] = useState([]),
    [meetingDocs, setMeetingDocs] = useState([]),
    [text, setText] = useState(""),
    [error, setError] = useState("");
  const [meeting, setMeeting] = useState({
    title: "Team Meeting",
    agenda: "",
    startsAt: "",
    endsAt: "",
    meetingType: "ONLINE",
    meetingUrl: "",
    location: "",
    epicId: "",
    inviteAllTeam: true,
    attendeeIds: [],
  });
  const endRef = useRef();
  const visibleUsers = useMemo(
    () => users.filter((u) => Number(u.id ?? u.userId) !== me),
    [users, me],
  );
  useEffect(() => {
    Promise.all([getUsers(), getProjects()])
      .then(([u, p]) => {
        setUsers(u || []);
        setProjects(p || []);
        if ((u || []).find((x) => Number(x.id ?? x.userId) !== me))
          setSelectedUser(
            String(
              (u || []).find((x) => Number(x.id ?? x.userId) !== me).id ??
                (u || []).find((x) => Number(x.id ?? x.userId) !== me).userId,
            ),
          );
        if (p?.length) setProjectId(String(p[0].id));
      })
      .catch((e) =>
        setError(
          e?.response?.data?.message || "Unable to load communication data.",
        ),
      );
  }, []);
  useEffect(() => {
    if (!projectId) return;
    Promise.all([
      getProjectUsers(projectId),
      getActiveEpicsByProject(projectId),
    ])
      .then(([members, es]) => {
        setTeam(
          (members || []).map((x) =>
            x.user
              ? x.user
              : { id: x.userId, name: x.userName, email: x.userEmail },
          ),
        );
        setEpics(es || []);
      })
      .catch(() => {});
  }, [projectId]);
  const load = async () => {
    try {
      setError("");
      if (tab === 0 && selectedUser)
        setMessages(await getDirectMessages(selectedUser));
      if (tab === 1 && projectId)
        setMessages(await getProjectMessages(projectId));
      if (tab === 2 && projectId) {
        const ms = await getProjectMeetings(projectId);
        setMeetings(ms || []);
        if (meetingId) {
          setMessages(await getMeetingMessages(meetingId));
          setMeetingDocs(await getMeetingDocuments(meetingId));
        }
      }
    } catch (e) {
      setError(
        e?.response?.data?.message || "Unable to load communication data.",
      );
    }
  };
  useEffect(() => {
    load();
  }, [tab, selectedUser, projectId, meetingId]);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    if (
      (tab === 0 && !selectedUser) ||
      (tab === 1 && !projectId) ||
      (tab === 2 && !meetingId)
    )
      return;
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, [tab, selectedUser, projectId, meetingId]);
  const send = async () => {
    if (!text.trim()) return;
    try {
      if (tab === 0) await sendDirectMessage(selectedUser, text);
      else if (tab === 1) await sendProjectMessage(projectId, text);
      else await sendMeetingMessage(meetingId, text);
      setText("");
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || "Message could not be sent.");
    }
  };
  const schedule = async () => {
    try {
      const payload = {
        ...meeting,
        startsAt: toIso(meeting.startsAt),
        endsAt: toIso(meeting.endsAt),
        epicId: meeting.epicId ? Number(meeting.epicId) : null,
        attendeeIds: meeting.attendeeIds.map(Number),
        meetingUrl:
          meeting.meetingType === "ONLINE" ? meeting.meetingUrl : null,
        location: meeting.meetingType === "OFFLINE" ? meeting.location : null,
      };
      const saved = await createProjectMeeting(projectId, payload);
      setMeetings(await getProjectMeetings(projectId));
      setMeetingId(String(saved.id));
      setMeeting({
        title: "Team Meeting",
        agenda: "",
        startsAt: "",
        endsAt: "",
        meetingType: "ONLINE",
        meetingUrl: "",
        location: "",
        epicId: "",
        inviteAllTeam: true,
        attendeeIds: [],
      });
    } catch (e) {
      setError(e?.response?.data?.message || "Meeting could not be scheduled.");
    }
  };
  const uploadDoc = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !meetingId) return;
    try {
      const doc = await createDocument(file.name, file);
      await attachMeetingDocument(meetingId, doc.id);
      setMeetingDocs(await getMeetingDocuments(meetingId));
    } catch (err) {
      setError(
        err?.response?.data?.message || "Document could not be attached.",
      );
    }
    e.target.value = "";
  };
  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={800}>
        Team Communication
      </Typography>
      <Typography color="text.secondary">
        Direct chat, project/team chat and meeting workspace.
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Card>
        <Tabs
          value={tab}
          onChange={(_, v) => {
            setTab(v);
            setMeetingId("");
            setMessages([]);
          }}
        >
          <Tab label="Direct Chat" />
          <Tab label="Team Chat" />
          <Tab label="Meetings" />
        </Tabs>
        <Divider />
        <CardContent>
          {tab === 0 && (
            <Select
              fullWidth
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Select teammate</MenuItem>
              {visibleUsers.map((u) => (
                <MenuItem
                  key={u.id ?? u.userId}
                  value={String(u.id ?? u.userId)}
                >
                  {u.name} — {u.email}
                </MenuItem>
              ))}
            </Select>
          )}
          {tab === 1 && (
            <Select
              fullWidth
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              {projects.map((p) => (
                <MenuItem key={p.id} value={String(p.id)}>
                  {p.name} ({p.ticketPrefix || "PROJECT"})
                </MenuItem>
              ))}
            </Select>
          )}
          {tab === 0 || tab === 1 ? (
            <>
              <PaperMessages messages={messages} me={me} endRef={endRef} />
              <Composer text={text} setText={setText} send={send} />
            </>
          ) : (
            <>
              <Select
                fullWidth
                value={projectId}
                onChange={(e) => {
                  setProjectId(e.target.value);
                  setMeetingId("");
                }}
              >
                {projects.map((p) => (
                  <MenuItem key={p.id} value={String(p.id)}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
              <GridMeetingForm
                meeting={meeting}
                setMeeting={setMeeting}
                team={team}
                epics={epics}
                schedule={schedule}
              />
              <Divider sx={{ my: 2 }} />
              <List>
                {meetings.map((m) => (
                  <ListItem key={m.id} disableGutters>
                    <Card variant="outlined" sx={{ width: "100%", p: 2 }}>
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        justifyContent="space-between"
                        gap={2}
                      >
                        <Box>
                          <Typography fontWeight={800}>{m.title}</Typography>
                          <Typography variant="body2">
                            {localDate(m.startsAt)}{" "}
                            {m.endsAt && `– ${localDate(m.endsAt)}`}
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                            mt={1}
                            flexWrap="wrap"
                          >
                            <Chip size="small" label={m.meetingType} />
                            {m.epicName && (
                              <Chip
                                size="small"
                                label={`Epic: ${m.epicName}`}
                              />
                            )}
                            <Chip
                              size="small"
                              label={
                                m.inviteAllTeam
                                  ? "Whole team"
                                  : `${m.attendees?.length || 0} invited`
                              }
                            />
                          </Stack>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {m.meetingType === "ONLINE"
                              ? m.meetingUrl
                              : m.location}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {m.agenda}
                          </Typography>
                        </Box>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          flexWrap="wrap"
                        >
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setMeetingId(String(m.id))}
                          >
                            Discussion
                          </Button>
                          {m.meetingType === "ONLINE" && m.meetingUrl && (
                            <Button
                              size="small"
                              component="a"
                              href={m.meetingUrl}
                              target="_blank"
                              rel="noreferrer"
                              startIcon={<VideoCallRoundedIcon />}
                            >
                              Join
                            </Button>
                          )}
                          {m.status === "SCHEDULED" && (
                            <Button
                              size="small"
                              onClick={async () => {
                                await updateMeetingStatus(m.id, "COMPLETED");
                                setMeetings(
                                  await getProjectMeetings(projectId),
                                );
                              }}
                            >
                              Complete
                            </Button>
                          )}
                        </Stack>
                      </Stack>
                    </Card>
                  </ListItem>
                ))}
              </List>
              {meetingId && (
                <Card variant="outlined" sx={{ p: 2, mt: 1 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="h6">Meeting discussion</Typography>
                    <Button
                      component="label"
                      startIcon={<AttachFileRoundedIcon />}
                    >
                      Add document
                      <input hidden type="file" onChange={uploadDoc} />
                    </Button>
                  </Stack>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Discussion and documents are scoped to this meeting.
                  </Typography>
                  <PaperMessages messages={messages} me={me} endRef={endRef} />
                  <Composer text={text} setText={setText} send={send} />
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ mt: 2 }}
                  >
                    Meeting documents
                  </Typography>
                  {meetingDocs.map((d) => (
                    <Stack
                      key={d.documentId}
                      direction="row"
                      spacing={1}
                      alignItems="center"
                    >
                      <Typography>{d.originalName || d.name}</Typography>
                      <Button
                        size="small"
                        component="a"
                        href={`/api/documents/${d.documentId}/download`}
                        target="_blank"
                      >
                        Open
                      </Button>
                      <Button
                        size="small"
                        onClick={async () => {
                          await removeMeetingDocument(meetingId, d.documentId);
                          setMeetingDocs(await getMeetingDocuments(meetingId));
                        }}
                      >
                        Remove
                      </Button>
                    </Stack>
                  ))}
                </Card>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
function PaperMessages({ messages, me, endRef }) {
  return (
    <Paper
      variant="outlined"
      sx={{ mt: 2, p: 2, height: 430, overflowY: "auto" }}
    >
      {messages.map((m) => (
        <Box
          key={m.id}
          sx={{
            display: "flex",
            justifyContent:
              Number(m.senderId) === me ? "flex-end" : "flex-start",
            mb: 1.5,
          }}
        >
          <Paper sx={{ p: 1.25, maxWidth: "75%", borderRadius: 3 }}>
            <Typography variant="caption" fontWeight={700} display="block">
              {Number(m.senderId) === me
                ? "You"
                : m.senderName || "Unknown user"}
            </Typography>
            <Typography variant="body1">{m.content}</Typography>
            <Typography variant="caption" color="text.secondary">
              {localDate(m.createdAt)}
            </Typography>
          </Paper>
        </Box>
      ))}
      <div ref={endRef} />
    </Paper>
  );
}
function Composer({ text, setText, send }) {
  return (
    <Stack direction="row" spacing={1} mt={2}>
      <TextField
        fullWidth
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())
        }
        placeholder="Write a message…"
        multiline
        maxRows={3}
      />
      <Button variant="contained" onClick={send} endIcon={<SendRoundedIcon />}>
        Send
      </Button>
    </Stack>
  );
}
function GridMeetingForm({ meeting, setMeeting, team, epics, schedule }) {
  return (
    <Stack spacing={1.5} mt={2}>
      <Typography variant="h6">Schedule meeting</Typography>
      <TextField
        label="Meeting title"
        value={meeting.title}
        onChange={(e) => setMeeting({ ...meeting, title: e.target.value })}
      />
      <TextField
        label="Agenda"
        multiline
        minRows={3}
        value={meeting.agenda}
        onChange={(e) => setMeeting({ ...meeting, agenda: e.target.value })}
      />
      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
        <TextField
          fullWidth
          type="datetime-local"
          label="Starts"
          InputLabelProps={{ shrink: true }}
          value={meeting.startsAt}
          onChange={(e) => setMeeting({ ...meeting, startsAt: e.target.value })}
        />
        <TextField
          fullWidth
          type="datetime-local"
          label="Ends"
          InputLabelProps={{ shrink: true }}
          value={meeting.endsAt}
          onChange={(e) => setMeeting({ ...meeting, endsAt: e.target.value })}
        />
      </Stack>
      <FormControl fullWidth>
        <InputLabel>Meeting type</InputLabel>
        <Select
          value={meeting.meetingType}
          label="Meeting type"
          onChange={(e) =>
            setMeeting({ ...meeting, meetingType: e.target.value })
          }
        >
          <MenuItem value="ONLINE">Online</MenuItem>
          <MenuItem value="OFFLINE">Offline</MenuItem>
        </Select>
      </FormControl>
      {meeting.meetingType === "ONLINE" ? (
        <TextField
          label="Meeting URL"
          placeholder="https://…"
          value={meeting.meetingUrl}
          onChange={(e) =>
            setMeeting({ ...meeting, meetingUrl: e.target.value })
          }
        />
      ) : (
        <TextField
          label="Location / room"
          value={meeting.location}
          onChange={(e) => setMeeting({ ...meeting, location: e.target.value })}
        />
      )}
      <FormControl fullWidth>
        <InputLabel>Epic (optional)</InputLabel>
        <Select
          value={meeting.epicId}
          label="Epic (optional)"
          onChange={(e) => setMeeting({ ...meeting, epicId: e.target.value })}
        >
          <MenuItem value="">No epic</MenuItem>
          {epics.map((e) => (
            <MenuItem key={e.id} value={String(e.id)}>
              {e.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Invite attendees</InputLabel>
        <Select
          multiple
          value={meeting.attendeeIds}
          onChange={(e) =>
            setMeeting({
              ...meeting,
              attendeeIds:
                typeof e.target.value === "string"
                  ? e.target.value.split(",")
                  : e.target.value,
            })
          }
          input={<OutlinedInput label="Invite attendees" />}
          renderValue={(selected) => (
            <Stack direction="row" gap={0.5} flexWrap="wrap">
              {selected.map((id) => (
                <Chip
                  key={id}
                  label={
                    team.find((u) => String(u.id ?? u.userId) === String(id))
                      ?.name || id
                  }
                />
              ))}
            </Stack>
          )}
        >
          {team.map((u) => {
            const id = String(u.id ?? u.userId);
            return (
              <MenuItem key={id} value={id}>
                <Checkbox checked={meeting.attendeeIds.includes(id)} />
                {u.name} — {u.email}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <Stack direction="row" alignItems="center">
        <Checkbox
          checked={meeting.inviteAllTeam}
          onChange={(e) =>
            setMeeting({ ...meeting, inviteAllTeam: e.target.checked })
          }
        />
        <Typography>Invite whole team</Typography>
      </Stack>
      <Button
        variant="contained"
        startIcon={<EventRoundedIcon />}
        onClick={schedule}
      >
        Schedule Meeting
      </Button>
    </Stack>
  );
}
