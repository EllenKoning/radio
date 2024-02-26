import React, {Component, useEffect, useState} from "react";
import Activity from "./Activity";
import Poster from "./Poster";
import { KOALA_ACTIVITY_ENDPOINT } from "../helpers/env";

//Utility function to change dates from activities to actual Date objects
function setDate(activity) {
  return Object.assign(
    {},
    activity,
    { has_start_time: activity.start_date.indexOf("T") > -1 },
    {
      has_end_time: activity.end_date && activity.end_date.indexOf("T") > -1,
    },
    { start_date: new Date(activity.start_date) },
    activity.end_date ? { end_date: new Date(activity.end_date) } : null
  );
}

// Get activities

function loadData(setState) {
  fetch(KOALA_ACTIVITY_ENDPOINT)
    // Fix activity dates and sort them on start_date
    .then((resp) => resp.json())
    .then((activities) =>
      activities.map(setDate).sort((a, b) => a.start_date - b.start_date)
    )
    .then((activities) => {
      setState({ activities: activities.filter((act) => act.poster) });
    });
}


export default function Activities (props) {
  const [state, setState] = useState({activities:[]})

  useEffect(() => {
    loadData(setState);
    const interval = setInterval( () =>
      loadData(setState),
      parseInt(import.meta.env.VITE_LOAD_INTERVAL)
    );
  }, []);

  if (state.activities.length > 0) {
    if (props.current >= state.activities.length - 1)
      props.onChange(true);
    let currentActivity = state.activities[props.current];
    return (
      <div>
        <ul className="activities">
          {state.activities.map((activity, i) => {
            return (
              <Activity
                key={i}
                {...activity}
                active={activity === currentActivity}
              />
            );
          })}
        </ul>
        <Poster poster={currentActivity ? currentActivity.poster : null} />
      </div>
    );
  }
  return <div />;

}
