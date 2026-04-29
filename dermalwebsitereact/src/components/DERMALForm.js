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
    const [duration,setDuration]=useState('Unknown')
    //to track symptoms
    const [symptoms,setSymptoms]=useState(
        {truesymptoms:[]}
    )
    const [DERMALResponse, setDERMALResponse] = useState(null);
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
       'I have symptoms not listed', 'This condition has given me a fever',
       'This condition has given me a chills', 'This condition has given me fatigue',
       'This condition has given me joint pain', 'This condition has given me mouth sores',
       'This condition has given me shortness of breath']

    //list of durations for creating the text of the form
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
    //track the state of the duration
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
     
    //format symptoms to give to backend
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
    
    //update the response area that gives condition list
    function handleResponseChange(e){
        setDERMALResponse(e)
    }

    function handleSubmit(e){
        e.preventDefault(); //Prevent default form submissions
        //clear previous output
        handleResponseChange({})
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
        //create a request token so django backend views request as valid
        api.interceptors.request.use(config => {  
            config.headers['X-CSRFToken'] = csrfToken;  
            return config;  
        }); 

        //add the data to the formData variable
        formData.append("symptoms",JSON.stringify(formatSymptoms()));
        
        formData.append("image",image);
        
        formData.append("duration",duration);
        
        //send formData as a POST request to backend, and wait for response
        api.post('',formData)
        .then(response => handleResponseChange(response.data)
            
        );
        if (DERMALResponse===""){
            handleResponseChange("none")
        }

    }

    function MakeConditionTable(){
        if (DERMALResponse){
            return(
                <table key={"table"}>
                    <thead key={"table head"}>
                        <tr key={"header row"}>
                            <th key={"likelihood header"}>Likelihood</th>
                            <th key={"name header"}>Condition Name</th>
                            <th key={"description header"}>Description</th>
                        </tr>
                    </thead>
                    <tbody key={"table body"}>
                        {Object.entries(DERMALResponse).map(element => (
                                
                                <tr key={element}>
                                    <td key={element[1].likelihood}>{(element[1].likelihood)}</td>
                                    <td key={element[1].condition}>{(element[1].condition)}</td>
                                    <td key={element[1].description}>{(element[1].description)}</td>
                                </tr>
                        ))}
                    </tbody>
                </table>
            )
        }
    }


    return(
        <div id="main" method='post' onSubmit={handleSubmit} >
            <h3>Upload image and symptoms</h3>
            <p>DERMAL is an image recognition algorithm that is able to give a preliminary diagnosis on several skin conditions. </p>
            <p>The following condition are the condition DERMAL is trained to identify: Allergic Contact Dermatitis, Insect Bite, Urticaria, Folliculitis, 
                Tinea versicolor, Herpes Zoster/Shingles, Irritant Contact Dermatitis, and Atopic dermatitis (eczema)
            </p>
            <form>
                <div id='mainForm'>
                    <div className='formItem'>
                        <label>Upload an image of the affected area:</label><br></br>
                        <input type="file" accept="image/*" onChange={handleImageChange}></input><br></br>    
                    </div>
                    {symptomTitles.map(element => (
                        <div key={element} className='formItem'>
                            <label>{element}:</label>
                            <input type="checkbox" value={element} onChange={handleSymptomChange}></input><br></br>
                        </div>
                    ))}
                    <div className='formItem'>
                        <label>The Duration of This Condition is: </label>    
                        <select name="duration" id="duration" onChange={handleDurationChange}>
                            {durationTitles.map(element => (
                                <option value={element} key={element}>{element}</option>
                            ))}
                        </select><br></br>
                    </div>
                    <div className='formbutton'>
                        <input type="submit" value="Submit"></input>
                    </div>
                </div>
            </form>
            
            <MakeConditionTable/>
            
            <footer>DERMAL is not a replacement for a dermatologist, DERMAL cannot give a diagnosis, if you are experiencing a medical emergency please contact emergency services.</footer>

        </div>
    )
}

export default DERMALForm;