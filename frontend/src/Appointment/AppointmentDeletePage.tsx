import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Table, Alert } from "react-bootstrap";
import type { Appointment } from "../types/Appointment";
import * as AppointmentService from "./AppointmentService";
import * as PatientService from "../Patient/PatientService";
import * as PersonnelService from "../Personnel/PersonnelService";
import * as AvailableDayService from "../AvailableDays/AvailableDayService";

const AppointmentDeletePage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    const loadAppointment = async () => {
      setError(null);

      try {
        if (!appointmentId) {
          setError("No appointment ID provided");
          setLoading(false);
          return;
        }

        const appt = await AppointmentService.fetchAppointmentById(
          Number(appointmentId)
        );

        const [allPatients, allPersonnel, allDays] = await Promise.all([
          PatientService.fetchPatients(),
          PersonnelService.fetchPersonnels(),
          AvailableDayService.fetchAvailableDays(),
        ]);

        const patient = allPatients.find((p) => p.patientId === appt.patientId);
        const day = allDays.find((d) => d.id === appt.availableDayId);
        if (!day) throw new Error("Related available day not found");

        const personnel = allPersonnel.find((p) => p.id === day.personnelId);

        setAppointment({
          ...appt,
          patient,
          availableDay: { ...day, personnel },
        });
      } catch (err) {
        console.error("Failed to fetch appointment:", err);
        if (err instanceof Error) setError(err.message);
        else setError("Failed to load appointment");
      } finally {
        setLoading(false);
      }
    };

    void loadAppointment();
  }, [appointmentId]);

  const handleDelete = async () => {
    if (!appointment) return;
    if (!window.confirm("Are you sure you want to delete this appointment?"))
      return;

    try {
      setDeleting(true);
      await AppointmentService.deleteAppointment(appointment.appointmentId);
      navigate("/appointment/manage");
    } catch (err) {
      console.error("Failed to delete appointment:", err);
      if (err instanceof Error) setError(err.message);
      else setError("Failed to delete appointment");
      setDeleting(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Delete Appointment</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {!appointment || !appointment.availableDay ? (
        <p>No appointment found</p>
      ) : (
        <>
          <p>Are you sure you want to delete this appointment?</p>

          <Table bordered>
            <tbody>
              <tr>
                <td>Patient</td>
                <td>{appointment.patient?.name || "Unknown"}</td>
              </tr>
              <tr>
                <td>Personnel</td>
                <td>{appointment.availableDay.personnel?.name || "Unknown"}</td>
              </tr>
              <tr>
                <td>Date</td>
                <td>{appointment.availableDay.date.split("T")[0]}</td>
              </tr>
              <tr>
                <td>Time</td>
                <td>
                  {appointment.availableDay.startTime} -{" "}
                  {appointment.availableDay.endTime}
                </td>
              </tr>
              <tr>
                <td>Notes</td>
                <td>{appointment.notes || "-"}</td>
              </tr>
            </tbody>
          </Table>

          <div className="d-flex flex-wrap gap-2 mt-3">
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Confirm Delete"}
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AppointmentDeletePage;
