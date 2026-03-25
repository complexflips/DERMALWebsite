import React, {useState,useEffect} from 'react';

function highlightRow(e){
    e.target.style.background = 'grey';
    e.target.style.color = 'black';
}
function unHighlightRow(e){
    e.target.style.background = '#fff';
    e.target.style.color = '#000';
}

function DisplayTasks(tasks){

    return(
        <div className="displayTable">
            <table>
                <tr>
                    <th>TaskID</th>
                    <th>Task</th>
                    <th>Created</th>
                    <th>Completed</th>
                </tr>
                {tasks.taskTable.map ((task)=>(
                    <tr onMouseOver={highlightRow} onMouseLeave={unHighlightRow}>
                        <td key={task._id}>{task._id}</td>
                        <td key={task._id}>{task.name}</td>
                        <td key={task._id}>{task.timeMade}</td>
                        <td key={task._id}>{String(task.completed)}</td>
                    </tr>
                ))}
            </table>
        </div>
    )
}

export default DisplayTasks;