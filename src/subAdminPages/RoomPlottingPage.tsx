import React, { useState } from "react";

const RoomPlottingPage: React.FC = () => {
  // Sample data for rooms
  const rooms = [
    { id: "201", name: "ROOM 201", type: "Lecture", department: "CCS", status: "available" },
    { id: "202", name: "ROOM 202", type: "Lecture", department: "CCS", status: "occupied" },
    { id: "203", name: "ROOM 203", type: "Lecture", department: "CCS", status: "available" },
    { id: "301", name: "ROOM 301", type: "Lecture", department: "CCS", status: "available" },
    { id: "302", name: "ROOM 302", type: "Lecture", department: "CCS", status: "occupied" },
    { id: "303", name: "ROOM 303", type: "Lecture", department: "CCS", status: "available" },
    { id: "304", name: "ROOM 304", type: "Lecture", department: "CCS", status: "available" },
    { id: "305", name: "ROOM 305", type: "Lecture", department: "CCS", status: "occupied" },
    { id: "306", name: "ROOM 306", type: "Lecture", department: "CCS", status: "available" },
    { id: "307", name: "ROOM 307", type: "Lecture", department: "CCS", status: "available" },
    { id: "308", name: "ROOM 308", type: "Lecture", department: "CCS", status: "occupied" },
    { id: "309", name: "ROOM 309", type: "Lecture", department: "CCS", status: "available" },
    { id: "310", name: "ROOM 310", type: "Lecture", department: "CCS", status: "available" },
    { id: "311", name: "ROOM 311", type: "Lecture", department: "CCS", status: "occupied" },
    { id: "312", name: "ROOM 312", type: "Lecture", department: "CCS", status: "available" },
    { id: "313", name: "ROOM 313", type: "Lecture", department: "CCS", status: "available" },
    { id: "314", name: "ROOM 314", type: "Lecture", department: "CCS", status: "occupied" },
    { id: "315", name: "ROOM 315", type: "Lecture", department: "CCS", status: "available" },
    { id: "316", name: "ROOM 316", type: "Lecture", department: "CCS", status: "available" },
    { id: "317", name: "ROOM 317", type: "Lecture", department: "CCS", status: "occupied" },
    { id: "318", name: "ROOM 318", type: "Lecture", department: "CCS", status: "available" },
    { id: "319", name: "ROOM 319", type: "Lecture", department: "CCS", status: "available" },
    { id: "321", name: "ROOM 321", type: "Lecture", department: "CCS", status: "available" },
    { id: "322", name: "ROOM 322", type: "Lecture", department: "CCS", status: "available" },
  ];

  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [showTimetable, setShowTimetable] = useState(false);

  // Sample data for the timetable (mock schedule)
  const sampleSchedule = [
    { day: "Monday", startTime: "8:00 AM", endTime: "9:30 AM", subject: "CS101", professor: "Dr. Smith" },
    { day: "Monday", startTime: "1:00 PM", endTime: "2:30 PM", subject: "CS202", professor: "Dr. Johnson" },
    { day: "Wednesday", startTime: "10:00 AM", endTime: "11:30 AM", subject: "CS101", professor: "Dr. Smith" },
    { day: "Thursday", startTime: "3:00 PM", endTime: "4:30 PM", subject: "CS303", professor: "Dr. Williams" },
  ];

  const handleRoomClick = (roomId: string) => {
    setSelectedRoom(roomId);
  };

  const handleSeePlotting = (roomId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the room div click event
    setSelectedRoom(roomId);
    setShowTimetable(true);
  };

  // Generate time slots from 6am to 9pm in 30-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 21; hour++) {
      // Format for the full hour (e.g., 6:00 AM)
      const period = hour < 12 ? "AM" : "PM";
      const displayHour = hour <= 12 ? hour : hour - 12;
      const fullHourTime = `${displayHour}:00 ${period}`;
      
      // Add the full hour slot
      slots.push({
        display: fullHourTime,
        range: `${fullHourTime} - ${displayHour}:30 ${period}`
      });
      
      // Check if we're not at the last hour (9:00 PM)
      if (hour < 21) {
        // Format for the half hour (e.g., 6:30 AM)
        const nextPeriod = hour < 11 ? "AM" : "PM";
        const nextDisplayHour = hour + 1 <= 12 ? hour + 1 : hour - 11;
        const halfHourTime = `${displayHour}:30 ${period}`;
        const nextHourTime = `${nextDisplayHour}:00 ${nextPeriod}`;
        
        // Add the half hour slot
        slots.push({
          display: halfHourTime,
          range: `${halfHourTime} - ${nextHourTime}`
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Days of the week
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Check if a schedule falls within a time slot
  const getScheduleForTimeSlot = (day: string, timeSlot: { display: string, range: string }) => {
    return sampleSchedule.find(schedule => {
      const startTime = timeSlot.range.split(" - ")[0].trim();
      
      // This is a simplified check - in a real app you'd need more sophisticated time comparison
      return schedule.day === day && 
             (schedule.startTime === startTime || 
              schedule.startTime < startTime && schedule.endTime > startTime);
    });
  };

  // Function to determine if a schedule spans multiple time slots
  interface Schedule {
    day: string;
    startTime: string;
    endTime: string;
    subject: string;
    professor: string;
  }
  
  const isScheduleSpan = (schedule: Schedule | undefined) => {
    if (!schedule) return false;
    
    // Check if this schedule appears in the next time slot too (simplified version)
    const scheduleHours = parseFloat(schedule.endTime.split(":")[0]) - parseFloat(schedule.startTime.split(":")[0]);
    
    // If schedule is longer than 30 minutes, it spans multiple slots
    return scheduleHours >= 1;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <select className="p-2 rounded-md border border-gray-300">
          <option>Department</option>
          <option>CCS</option>
          <option>COE</option>
        </select>

        <select className="p-2 rounded-md border border-gray-300">
          <option>Building</option>
          <option>Main</option>
          <option>Annex</option>
        </select>

        <select className="p-2 rounded-md border border-gray-300">
          <option>Room Type</option>
          <option>Lecture</option>
          <option>Laboratory</option>
        </select>
      </div>

      {/* Timetable Title */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-bold">MAIN</h2>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-6 gap-2 p-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className={`p-4 text-center rounded-lg cursor-pointer ${
              room.status === "available"
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
            onClick={() => handleRoomClick(room.id)}
          >
            <div>{room.name}</div>
            <div>{room.type}</div>
            <div>{room.department}</div>
            {room.status === "available" ? (
              <button 
                className="mt-2 p-2 bg-yellow-500 text-black rounded-md"
                onClick={(e) => handleSeePlotting(room.id, e)}
              >
                See Plotting
              </button>
            ) : (
              <div className="mt-2 text-red-500">Occupied</div>
            )}
          </div>
        ))}
      </div>

      {/* Timetable Modal */}
      {showTimetable && selectedRoom && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center overflow-auto">
          <div className="bg-white p-6 rounded-lg max-w-7xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Room {selectedRoom} - Weekly Schedule</h3>
              <button
                onClick={() => setShowTimetable(false)}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="w-24 border p-2 bg-gray-100">Time</th>
                  {daysOfWeek.map(day => (
                    <th key={day} className="border p-2 bg-gray-100">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((timeSlot, index) => (
                  <tr key={timeSlot.display}>
                    <td className="border p-2 text-center font-medium bg-gray-50 text-sm">
                      {timeSlot.range}
                    </td>
                    {daysOfWeek.map(day => {
                      // Find schedule for this day and time
                      const schedule = getScheduleForTimeSlot(day, timeSlot);
                      
                      // If there's already a schedule spanning from a previous slot, skip
                      const previousSlotSchedule = index > 0 ? getScheduleForTimeSlot(day, timeSlots[index-1]) : null;
                      const isPartOfPreviousSpan = previousSlotSchedule && isScheduleSpan(previousSlotSchedule);
                      
                      return (
                        <td key={`${day}-${timeSlot.display}`} className="border p-2 text-center h-12">
                          {schedule && !isPartOfPreviousSpan ? (
                            <div className="bg-blue-100 p-2 rounded h-full">
                              <p className="font-bold text-sm">{schedule.subject}</p>
                              <p className="text-xs">{schedule.professor}</p>
                              <p className="text-xs">{schedule.startTime} - {schedule.endTime}</p>
                            </div>
                          ) : ""}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowTimetable(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomPlottingPage;