"use client";
import { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { createClient } from "@supabase/supabase-js";
import HomeWorkCard from "./components/HomeWorkCard";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [subjects, setSubjects] = useState<any[]>([]); // Fächer
  const [selectedSubject, setSelectedSubject] = useState<string>(""); // Ausgewähltes Fach
  const [homeworks, setHomeworks] = useState<any[]>([]); // Hausaufgaben
  const [open, setOpen] = useState(false); // Dialog-Status
  const [newHomework, setNewHomework] = useState({
    subject_fk: "",
    short_description: "",
    content: "",
  });

  // Fetch subjects on initial load
  useEffect(() => {
    async function fetchSubjects() {
      const { data, error } = await supabase.from("subject").select();
      if (error) {
        console.error("Error fetching subjects:", error);
        setSubjects([]); // Standardwert bei Fehler
      } else {
        setSubjects(data || []); // Standardwert bei `null`
      }
    }
    fetchSubjects();
  }, []);

  // Fetch homeworks whenever selectedSubject changes
  useEffect(() => {
    async function fetchHomeworks() {
      let query = supabase.from("homework").select("*");
      if (selectedSubject) {
        query = query.eq("subject_fk", selectedSubject);
      }
      const { data, error } = await query;
      if (error) {
        console.error("Error fetching homeworks:", error);
        setHomeworks([]); // Standardwert bei Fehler
      } else {
        setHomeworks(data || []); // Standardwert bei `null`
      }
    }
    fetchHomeworks();
  }, [selectedSubject]);

  const handleChange = (event: any) => {
    setSelectedSubject(event.target.value);
  };

  const handleOpen = () => setOpen(true); // Öffne Dialog
  const handleClose = () => setOpen(false); // Schließe Dialog

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewHomework((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { data, error } = await supabase.from("homework").insert([newHomework]);
    if (error) {
      console.error("Error inserting homework:", error);
    } else {
      console.log("Homework added:", data);
      setHomeworks((prev) => [...prev, ...(data || [])]);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      handleClose();
    }
  };

  return (
    <div>
      <div className="headline">
        <h1>HTL Dornbirn Hausaufgaben</h1>
      </div>
      <div className="filter">
        <FormControl fullWidth>
          <InputLabel>Fach</InputLabel>
          <Select
            value={selectedSubject}
            label="Fach"
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>Alle</em>
            </MenuItem>
            {(subjects || []).map((subject) => (
              <MenuItem key={subject.id} value={subject.id}>
                {subject.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div style={{ margin: "16px 0" }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Hausaufgaben hinzufügen
        </Button>
      </div>
      <div>
        {homeworks.length > 0 ? (
          homeworks.map((homework) => (
            <HomeWorkCard
              key={homework.id}
              homeWorkName={homework.short_description}
              homeWorkDescription={homework.content}
            />
          ))
        ) : (
          <p>Keine Hausaufgaben gefunden.</p>
        )}
      </div>

      {/* Dialog für neue Hausaufgabe */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Neue Hausaufgabe hinzufügen</DialogTitle>
        <DialogContent>
          <FormControl fullWidth style={{ marginBottom: "16px", marginTop: "16px" }}>
            <InputLabel>Fach</InputLabel>
            <Select
              value={newHomework.subject_fk}
              label="Fach"
              onChange={(e) =>
                setNewHomework((prev) => ({ ...prev, subject_fk: e.target.value }))
              }
            >
              {(subjects || []).map((subject) => (
                <MenuItem key={subject.id} value={subject.id}>
                  {subject.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Kurzbeschreibung"
            name="short_description"
            value={newHomework.short_description}
            onChange={handleInputChange}
            style={{ marginBottom: "16px" }}
          />
          <TextField
            fullWidth
            label="Inhalt"
            name="content"
            value={newHomework.content}
            onChange={handleInputChange}
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Hinzufügen
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
