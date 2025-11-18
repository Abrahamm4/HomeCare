import React, {useState} from "react";
import {Button, Form} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const CreateAvailableDayPage: React.FC = () => {
    const navigate = useNavigate();
    //const handleAvailableDayCreated = async (day: )
    const [form, setForm] = useState({PersonnelId:'', Date:'', StartTime:'', EndTime:''});
    const handleSubmit=(e: React.FormEvent)=>{
        e.preventDefault();
        //placeholder for creating available day logic
        console.log(form);
        navigate('/available-days');
    };
    return(
        <div>

        </div>
    )
}
export default CreateAvailableDayPage;