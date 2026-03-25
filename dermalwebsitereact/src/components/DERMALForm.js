import { useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';


function DERMALForm(){
    const csrfToken = Cookies.get('csrftoken')
    const [name,setName]=useState("")
    const labelTitles=['textures_raised_or_bumpy',
       'textures_flat', 'textures_rough_or_flaky', 'textures_fluid_filled',
       'body_parts_head_or_neck', 'body_parts_arm', 'body_parts_palm',
       'body_parts_back_of_hand', 'body_parts_torso_front',
       'body_parts_torso_back', 'body_parts_genitalia_or_groin',
       'body_parts_buttocks', 'body_parts_leg', 'body_parts_foot_top_or_side',
       'body_parts_foot_sole', 'body_parts_other',
       'condition_symptoms_bothersome_appearance',
       'condition_symptoms_bleeding', 'condition_symptoms_increasing_size',
       'condition_symptoms_darkening', 'condition_symptoms_itching',
       'condition_symptoms_burning', 'condition_symptoms_pain',
       'condition_symptoms_no_relevant_experience', 'other_symptoms_fever',
       'other_symptoms_chills', 'other_symptoms_fatigue',
       'other_symptoms_joint_pain', 'other_symptoms_mouth_sores',
       'other_symptoms_shortness_of_breath',
       'other_symptoms_no_relevant_symptoms']

    const duration=[
        'UNKNOWN',
        'ONE_DAY',
        'LESS_THAN_ONE_WEEK',
        'ONE_TO_FOUR_WEEKS',
        'ONE_TO_THREE_MONTHS',
        'THREE_TO_TWELVE_MONTHS',
        'MORE_THAN_ONE_YEAR',
        'MORE_THAN_FIVE_YEARS',
        'SINCE_CHILDHOOD',
    ]

    function formCheckBoxes(value,index,array){
        ''
    }

    function handleChange(e){
        setName(e.target.value);
    }

    function handleSubmit(e){
        
    }

    return(
        <div id="form" method='post' onSubmit={handleSubmit} >
            <h3>Upload image and symptoms</h3>
            <form>
                <label for="cname">Upload an image:</label><br></br>
                <input type="file"></input><br></br>
                <label>Enter your symptoms/location:</label><br></br>

                {labelTitles.map(element => (
                    <li>
                        <label>{element}:</label><br></br>
                        <input type="checkbox"></input><br></br>
                    </li>
                ))}
                
                <label>duration:</label><br></br>
                <select name="cars" id="cars">
                    {duration.map(element => (
                        <option value={element}>{element}</option>
                    ))}
                </select>
                

            </form>
        </div>
    )
}

export default DERMALForm;