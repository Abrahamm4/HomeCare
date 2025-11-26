import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Table } from "react-bootstrap";
import type { Appointment } from "../types/Appointment";
import * as AppointmentService from "./AppointmentService";
import * as PatientService from "../Patient/PatientService";
import * as PersonnelService from "../Personnel/PersonnelService";
import * as AvailableDayService from "../AvailableDays/AvailableDayService";

const AppointmentDeletePage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAppointment = async () => {
      try {
        if (!appointmentId) throw new Error("No appointment selected");

        const appt = await AppointmentService.fetchAppointmentById(Number(appointmentId));

        const [allPatients, allPersonnel, allDays] = await Promise.all([
          PatientService.fetchPatients(),
          PersonnelService.fetchPersonnels(),
          AvailableDayService.fetchAvailableDays(),
        ]);

        const patient = allPatients.find((p) => p.patientId === appt.patientId);
        const day = allDays.find((d) => d.id === appt.availableDayId);
        if (!day) throw new Error("Available day not found");

        const personnel = allPersonnel.find((p) => p.id === day.personnelId);

        setAppointment({
          ...appt,
          patient,
          availableDay: {
            id: day.id,
            personnelId: day.personnelId,
            date: day.date,
            startTime: day.startTime,
            endTime: day.endTime,
            isBooked: day.isBooked,
            personnel: personnel || undefined,
          },
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load appointment");
      } finally {
        setLoading(false);
      }
    };

    loadAppointment();
  }, [appointmentId]);

  const handleDelete = async () => {
    if (!appointment) return;
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;

    try {
      await AppointmentService.deleteAppointment(appointment.appointmentId);
      navigate("/appointment/manage");
    } catch (err) {
      console.error(err);
      setError("Failed to delete appointment");
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!appointment || !appointment.availableDay) return <p>Appointment not found</p>;

  return (
    <div>
      <h1>Delete Appointment</h1>
      <Table bordered>
        <tbody>
          <tr>
            <td>Patient</td>
            <td>{appointment.patient?.name || "Unknown"}</td>
          </tr>
          <tr>
            <td>Date</td>
            <td>{new Date(appointment.availableDay.date).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td>Time</td>
            <td>{`${appointment.availableDay.startTime} - ${appointment.availableDay.endTime}`}</td>
          </tr>
          <tr>
            <td>Personnel</td>
            <td>{appointment.availableDay.personnel?.name || "-"}</td>
          </tr>
          <tr>
            <td>Notes</td>
            <td>{appointment.notes || "-"}</td>
          </tr>
        </tbody>
      </Table>

      <Button variant="danger" onClick={handleDelete}>Delete</Button>
      <Button variant="secondary" className="ms-2" onClick={() => navigate(-1)}>Cancel</Button>
    </div>
  );
};

export default AppointmentDeletePage;
