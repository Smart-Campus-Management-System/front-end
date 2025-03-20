import Sidebar from "../Sidebar";
import React from "react";
import SchedulePage from "./SchedulePage";

export default function Schedule(){
    return(
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
            <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
                <Sidebar />
            </div>
            <div className="flex-1 ml-64 p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold text-white-800 mb-4">Schedule</h1>
                <SchedulePage/>
            </div>
        </div>
    )
}