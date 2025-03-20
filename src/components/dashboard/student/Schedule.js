import Sidebar from "../Sidebar";
import React from "react";
import SchedulePage from "./SchedulePage";
import TSchedulePage from "../tutor/TSchedulePage";

export default function Schedule(){
    return(

    <div className="bg-gray-100 flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
        {/* Sidebar */}
        <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
            <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64 overflow-y-auto">
            <div className="p-8 text-white">
                <h1 className="text-3xl font-bold mb-4">Schedule</h1>
            </div>

            {/* TSchedulePage is wrapped but not receiving additional padding to avoid conflicts */}
            <SchedulePage/>
        </div>
    </div>
    )
}
