import axios from "axios";
import Cookies from 'js-cookie';
import { useState } from 'react';


function DERMALForm(){
    //define constants
    //csrfToken for Django API authentication
    const csrfToken = Cookies.get('csrftoken')
    //for image input
    const [image,setImage]=useState("")
    //for duration input
    const [duration,setDuration]=useState('UNKNOWN')
    //to track symptoms
    const [symptoms,setSymptoms]=useState(
        {truesymptoms:[]}
    )
    const [DERMALResponse, setDERMALResponse] = useState("");
    //list of symptoms for creating the form
    const symptomTitles=['Is the texture raised or bumpy?',
       'Is the texture flat?', 'Is the texture rough or flaky?', 'Is this fluid filled?',
       'Is the affected region on your head or neck?', 'Is the affected region on your arm?',
       'Is the affected region on your palm?',
       'Is the affected region on the back of your hand?', 'Is the affected region on the front of your torso?',
       'Is the affected region on the back of your torso', 'Is the affected region on your genetalia or groin?',
       'Is the affected region on your buttox?', 'Is the affected region on your leg?', 
       'Is the affected region on the top or side of your foot?',
       'Is the affected region on the sole of your foot?', 'Is the affected region a body part not listed',
       'Does the condition cause a bothersome apperance',
       'Does the condition cause bleeding', 'Does the condition have an increasing size',
       'Does the condition cause a darkening of the skin', 'Does the condition cause itching',
       'Does the condition cause a burning sensation', 'Does the condition cause pain',
       'I did not experience any of the above symptoms', 'This condition has given me a fever',
       'This condition has given me a chills', 'This condition has given me fatigue',
       'This condition has given me joint pain', 'This condition has given me mouth sores',
       'This condition has given me shortness of breath']

    //list of durations for creating the form
    const durationTitles=[
        'Unknown',
        'One Day',
        'Less Than One Week',
        'One to Four Weeks',
        'One to Thee Months',
        'Three to Twelve Months',
        'More Than One Year',
        'More Than Five Years',
        'Since Childhood',
    ]

    //for handling the change of images and duration, simply take what the new value is
    //and apply it to our state
    function handleImageChange(e){
        setImage(e.target.files[0]);
    }
    function handleDurationChange(e){
        setDuration(e.target.value);
    }

    //track the state of each checkbox
    function handleSymptomChange(e){
        //delare value as the target input
        const {value,checked}=e.target;
        //"import" the currently tracked symptoms
        const {truesymptoms}=symptoms
        
        //if the input checkbox is being checked,
        //add the input checkbox value to the tracked symptom array
        if (checked)(
            setSymptoms({
                truesymptoms:[...truesymptoms,value]
            })
        );

        //otherwise remove it
        else(
            setSymptoms({
                truesymptoms:truesymptoms.filter(
                    e=>e!==value
                )
            })
        );
    }
     

    function formatSymptoms(){
        //create the object we will return with prefromatted dict
        const symptomTracker={};
        

        symptomTitles.forEach(
            function ifIn(item, index, arr){
            
            if (symptoms.truesymptoms.includes(item)){
                symptomTracker[item]=true
            }
            else{
                symptomTracker[item]=false
            }
        });
        return(symptomTracker)
    }
    
    function handleResponseChange(e){
        setDERMALResponse(e)
    }

    function handleSubmit(e){
        e.preventDefault(); //Prevent default form submissions
        handleResponseChange("")
        //require an image to submit form
        if (!image){
            alert("select an image file");
            return;
        }

        const formData= new FormData();

        //create an API post request to django
        const api=axios.create({
            baseURL:"http://localhost:8000/runDERMAL/",
            withCredentials: true
        })

        api.interceptors.request.use(config => {  
            config.headers['X-CSRFToken'] = csrfToken;  
            return config;  
        }); 

        formData.append("symptoms",JSON.stringify(formatSymptoms()));
        
        formData.append("image",image);
        
        formData.append("duration",duration);
        
        api.post('',formData)
        .then(response => handleResponseChange(response.data)
            
        );
        if (DERMALResponse===""){
            handleResponseChange("none")
        }

    }


    return(
        <div id="main" method='post' onSubmit={handleSubmit} >
            <h3>Upload image and symptoms</h3>
            <form>
                <div id='mainForm'>
                    <div class='formItem'>
                        <input type="file" accept="image/*" onChange={handleImageChange}></input><br></br>    
                    </div>
                    {symptomTitles.map(element => (
                        <div key={element} class='formItem'>
                            <label>{element}:</label>
                            <input type="checkbox" value={element} onChange={handleSymptomChange}></input><br></br>
                        </div>
                    ))}
                    <div class='formItem'>
                        <label>The Duration of This Condition is: </label>    
                        <select name="duration" id="duration" onChange={handleDurationChange}>
                            {durationTitles.map(element => (
                                <option value={element} key={element}>{element}</option>
                            ))}
                        </select><br></br>
                    </div>
                    <div class='formbutton'>
                        <input type="submit" value="Submit"></input>
                    </div>
                </div>
            </form>

            <p>{DERMALResponse}</p>

        </div>
    )
}

export default DERMALForm;