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
} from "@mui/material";
import { createClient } from "@supabase/supabase-js";
import HomeWorkCard from "./components/HomeWorkCard";
import style from './page.module.css'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [homeworks, setHomeworks] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [newHomework, setNewHomework] = useState({
    subject_fk: "",
    short_description: "",
    content: "",
  });

  useEffect(() => {
    async function fetchSubjects() {
      const { data, error } = await supabase.from("subject").select();
      if (error) {
        console.error("Error fetching subjects:", error);
        setSubjects([]);
      } else {
        setSubjects(data || []);
      }
    }
    fetchSubjects();
  }, []);

  useEffect(() => {
    async function fetchHomeworks() {
      let query = supabase.from("homework").select("*");
      if (selectedSubject) {
        query = query.eq("subject_fk", selectedSubject);
      }
      const { data, error } = await query;
      if (error) {
        console.error("Error fetching homeworks:", error);
        setHomeworks([]);
      } else {
        setHomeworks(data || []);
      }
    }
    fetchHomeworks();
  }, [selectedSubject]);

  const handleChange = (event: any) => {
    setSelectedSubject(event.target.value);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  const handleDelete = async (id: number) => {
    const { data, error } = await supabase
      .from("homework")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting homework:", error);
    } else {
      console.log("Homework deleted:", data);
      setHomeworks((prev) => prev.filter((homework) => homework.id !== id));
    }
  };

  return (
    <div>
      <div className={style["headline"]}>
        <h1>HTL Dornbirn Hausaufgaben</h1>
      </div>
      <div className={style["filter"]}>
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
      <div className={style["main-container-homework"]}>
        {homeworks.length > 0 ? (
          homeworks.map((homework: any) => (
            <div className={style["homework-container"]} key={homework.id}>
              <HomeWorkCard
                key={homework.id}
                homeWorkName={homework.short_description}
                homeWorkDescription={homework.content}
                onDelete={() => handleDelete(homework.id)}
              />
            </div>
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
          <div className={style["button-container-dialog"]}>
            <Button onClick={handleClose} color="secondary">
              Abbrechen
            </Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              Hinzufügen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
