import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Alert, Button } from "react-bootstrap";
import type { Appointment } from "../types/Appointment";
import * as AppointmentService from "./AppointmentService";
import * as PatientService from "../Patient/PatientService";
import * as PersonnelService from "../Personnel/PersonnelService";
import * as AvailableDayService from "../AvailableDays/AvailableDayService";

const AppointmentDetailsPage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
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

        const [patients, personnels, days] = await Promise.all([
          PatientService.fetchPatients(),
          PersonnelService.fetchPersonnels(),
          AvailableDayService.fetchAvailableDays(),
        ]);

        const patient = patients.find((p) => p.patientId === appt.patientId);
        const day = days.find((d) => d.id === appt.availableDayId);
        if (!day) throw new Error("Related available day not found");

        const personnel = personnels.find((p) => p.id === day.personnelId);

        setAppointment({
          ...appt,
          patient,
          availableDay: { ...day, personnel },
        });
      } catch (err) {
        console.error("Failed to load appointment:", err);

        if (err instanceof Error) setError(err.message);
        else setError("Failed to load appointment details");
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [appointmentId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Appointment Details</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {!appointment || !appointment.availableDay ? (
        <p>No appointment found</p>
      ) : (
        <>
          <p>
            <strong>Patient:</strong> {appointment.patient?.name || "Unknown"}
          </p>

          <p>
            <strong>Personnel:</strong>{" "}
            {appointment.availableDay.personnel?.name || "Unknown"}
          </p>

          <p>
            <strong>Date:</strong> {appointment.availableDay.date.split("T")[0]}
          </p>

          <p>
            <strong>Start Time:</strong> {appointment.availableDay.startTime}
          </p>

          <p>
            <strong>End Time:</strong> {appointment.availableDay.endTime}
          </p>

          <p>
            <strong>Notes:</strong> {appointment.notes || "-"}
          </p>

          <div className="d-flex flex-wrap gap-2 mt-3">
            <Link
              to={`/appointment/update/${appointment.appointmentId}`}
              className="btn btn-primary btn-sm"
            >
              Edit
            </Link>

            <Link
              to={`/appointment/delete/${appointment.appointmentId}`}
              className="btn btn-danger btn-sm"
            >
              Delete
            </Link>

            <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AppointmentDetailsPage;
