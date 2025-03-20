import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";
import Swal from "sweetalert2";


interface Room { 
  id: number;
  room_number: string;
  building: string;
  type: string;
  status: string;
  department: string | null;
  floor: number;
}

interface Department {
  value: string;
  label: string;
}

interface Building {
  value: number;
  label: string;
}

const safeDisplay = (value: string | number | null | undefined): string => {
  return value !== null && value !== undefined && String(value).trim() !== "" ? String(value) : "N/A";
};

const getBadgeColor = (
  status: string | null | undefined
): "success" | "warning" | "error" | "light" => {
  if (status === "Available") return "success";
  if (status === "Occupied") return "warning";
  if (status === "Out of Order") return "error";
  return "light";
};

const RoomTable: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");

  const [filterBuilding, setFilterBuilding] = useState<string>("");
  const [filterDepartment, setFilterDepartment] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterRoomType, setFilterRoomType] = useState<string>("");
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 10;

  const [newDepartment, setNewDepartment] = useState<string>("");
  const [newRoom, setNewRoom] = useState({
    room_number: "",
    building_id: "",
    room_type: "",
    floor_number: "",
    status: "Available",
    department: "",
  });
  
  // Available room types based on building selection
  const [availableRoomTypes, setAvailableRoomTypes] = useState<string[]>([]);

  useEffect(() => {
    fetchRooms();
    fetchRoomOptions();
  }, []);

  useEffect(() => {
    if (newRoom.building_id && newRoom.room_type) {
      fetchLatestRoomNumber(newRoom.building_id, newRoom.room_type);
    }
  }, [newRoom.building_id, newRoom.room_type]);

  useEffect(() => {
    applyFilters();
  }, [rooms, filterBuilding, filterDepartment, filterStatus, filterRoomType]);

  useEffect(() => {
    if (newRoom.building_id) {
      // Find building name based on selected building_id
      const selectedBuilding = buildings.find(b => b.value.toString() === newRoom.building_id);
      
      if (selectedBuilding) {
        if (selectedBuilding.label === "Bagong Cabuyao Hall" || selectedBuilding.label === "BCH") {
          // For BCH, only allow Lecture Room and Laboratory Room
          setAvailableRoomTypes(["Lecture Room", "Laboratory Room"]);
        } else if (selectedBuilding.label === "Main Building") {
          // For Main Building, allow all room types
          setAvailableRoomTypes([
            "Lecture Room", 
            "Laboratory Room", 
            "GYM", 
            "Computer Laboratory"
          ]);
        } else {
          // Default for other buildings - allow all room types
          setAvailableRoomTypes([
            "Lecture Room", 
            "Laboratory Room", 
            "GYM", 
            "Computer Laboratory"
          ]);
        }
      }
      
      // Reset room type when building changes
      setNewRoom(prev => ({
        ...prev,
        room_type: ""
      }));
    } else {
      // No building selected, reset available room types
      setAvailableRoomTypes([]);
    }
  }, [newRoom.building_id, buildings]);

  // ✅ Fetch all rooms
  const fetchRooms = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/api/rooms");
      setRooms(data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch rooms", "error");
      console.error("Error fetching rooms:", error);
    }
  };

  // ✅ Fetch departments & buildings
  const fetchRoomOptions = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/api/rooms/room-options");
      setDepartments(data.departments || []);
      setBuildings(data.buildings || []);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  // ✅ Handle Add Room Modal
  const handleAddRoom = () => {
    setNewRoom({
      room_number: "",
      building_id: "",
      room_type: "",
      floor_number: "",
      status: "Available",
      department: "",
    });
    setAvailableRoomTypes([]);
    setIsAddModalOpen(true);
  };


  // Update the building selection handler in the Add Room Modal
  const handleBuildingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const buildingId = e.target.value;
    setNewRoom(prevRoom => ({
      ...prevRoom,
      building_id: buildingId,
      // Clear room_type when building changes to force sequential selection
      room_type: "",
      // Clear room_number when building changes
      room_number: ""
    }));
  };

  // Update the room type selection handler
  const handleRoomTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roomType = e.target.value;
    setNewRoom(prevRoom => ({
      ...prevRoom,
      room_type: roomType
    }));
    // The useEffect will handle fetching the room number
  };

  // ✅ Handle Save Room
  const handleSaveRoom = async () => {
    if (!newRoom.room_number || !newRoom.building_id || !newRoom.room_type || !newRoom.floor_number) {
      Swal.fire("Error", "Please fill all required fields", "error");
      return;
    }

    try {
      await axios.post("http://localhost:3001/api/rooms", {
        room_number: newRoom.room_number,
        building_id: parseInt(newRoom.building_id),
        room_type: newRoom.room_type,
        floor_number: parseInt(newRoom.floor_number),
        status: newRoom.status,
        college_code: newRoom.status === "Occupied" ? newRoom.department : null,
      });

      Swal.fire("Success", "Room added successfully", "success");
      setIsAddModalOpen(false);
      fetchRooms();
    } catch (error) {
      Swal.fire("Error", "Failed to add room", "error");
      console.error("Error to add room:", error);
    }
  };

  // ✅ Handle Edit Room
  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room);
    setNewStatus(room.status);
    setNewDepartment(room.department || "");
    setIsEditModalOpen(true);
  };

  // ✅ Handle Save Changes
  const handleSaveChanges = async () => {
    if (!selectedRoom) return;

    try {
      await axios.put(`http://localhost:3001/api/rooms/${selectedRoom.id}`, {
        status: newStatus,
        college_code: newStatus === "Occupied" ? newDepartment : null,
      });

      Swal.fire("Success", "Room updated successfully", "success");
      setIsEditModalOpen(false);
      fetchRooms();
    } catch (error) {
      Swal.fire("Error", "Failed to update room", "error");
      console.error("Error to update room:", error);
    }
  };

  const fetchLatestRoomNumber = async (buildingId: string, roomType: string) => {
    if (!buildingId || !roomType) return;
    try {
      const { data } = await axios.get(`http://localhost:3001/api/rooms/latest-room/${buildingId}/${roomType}`);
      setNewRoom((prevRoom) => ({ ...prevRoom, room_number: data.room_number }));
    } catch (error) {
      console.error("Error fetching latest room number:", error);
      Swal.fire("Error", "Failed to fetch latest room number", "warning");
    }
  };

  // Apply filters based on selected criteria
  const applyFilters = () => {
    let updatedRooms = rooms;

    if (filterBuilding) {
      updatedRooms = updatedRooms.filter(room => room.building === filterBuilding);
    }

    if (filterDepartment) {
      updatedRooms = updatedRooms.filter(room => room.department === filterDepartment);
    }

    if (filterStatus) {
      updatedRooms = updatedRooms.filter(room => room.status === filterStatus);
    }

    if (filterRoomType) {
      updatedRooms = updatedRooms.filter(room => room.type === filterRoomType);
    }

    setFilteredRooms(updatedRooms);
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  // Pagination Logic
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  return (
    <div>
      <div className="flex items-center justify-between w-full mb-4">
        {/* Filters (Left Side) */}
        <div className="flex flex-wrap gap-x-4">
          {/* Building Filter */}
          <select
            className="p-3 border border-gray-400 rounded-lg text-black text-sm focus:outline-none  w-48"
            value={filterBuilding}
            onChange={(e) => setFilterBuilding(e.target.value)}
          >
            <option value="">All Buildings</option>
            {buildings.map(building => (
              <option key={building.value} value={building.label}>{building.label}</option>
            ))}
          </select>

          {/* Department Filter */}
          <select
            className="p-3 border border-gray-400 rounded-lg text-black text-sm focus:outline-none  w-48"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map(department => (
              <option key={department.value} value={department.value}>{department.value}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            className="p-3 border border-gray-400 rounded-lg text-black text-sm focus:outline-none  w-48"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Out of Order">Out of Order</option>
          </select>

          {/* Room Type Filter */}
          <select
            className="p-3 border border-gray-400 rounded-lg text-black text-sm focus:outline-none  w-48"
            value={filterRoomType}
            onChange={(e) => setFilterRoomType(e.target.value)}
          >
            <option value="">All Room Types</option>
            <option value="Lecture Room">Lecture Room</option>
            <option value="Laboratory Room">Laboratory Room</option>
            <option value="GYM">GYM</option>
            <option value="Computer Laboratory">Computer Laboratory</option>
          </select>
        </div>

        {/* ADD ROOM Button (Right Side) */}
        <Button onClick={handleAddRoom} className="bg-green-600 text-white ml-auto">
          ADD ROOM
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                    ROOM #
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                    BUILDING
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                    TYPE
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                    STATUS
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                    DEPARTMENT
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                    FLOOR
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                    ACTION
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRooms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="px-5 py-4 text-center text-gray-600">
                      No rooms available.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentRooms.map((room, index) => (
                    <TableRow
                      key={room.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-green-50"}
                    >
                      <TableCell className="px-5 py-4 text-start">
                        {safeDisplay(room.room_number)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        {safeDisplay(room.building)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        {safeDisplay(room.type)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <Badge color={getBadgeColor(room.status)} size="sm">
                          {safeDisplay(room.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        {room.status === "Occupied" ? safeDisplay(room.department) : "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        {safeDisplay(room.floor)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <button
                          onClick={() => handleEditRoom(room)}
                          className="text-gray-600 hover:text-green-600 focus:outline-none"
                          title="Edit Room"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {/* Integrated Pagination - now inside the same container as the table */}
        <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing {filteredRooms.length > 0 ? indexOfFirstRoom + 1 : 0} to {Math.min(indexOfLastRoom, filteredRooms.length)} of {filteredRooms.length} entries
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded px-2 py-1 text-xs text-gray-700"
            >
              Previous
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "primary" : "outline"}
                size="sm"
                onClick={() => paginate(i + 1)}
                className={`rounded px-2 py-1 text-xs ${
                  currentPage === i + 1 
                    ? "bg-green-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="rounded px-2 py-1 text-xs text-gray-700"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* ✅ Add Room Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} className="max-w-[700px] m-4">
        {/* Header with background image */}
        <div 
          className="bg-cover bg-center p-4 rounded-t-lg text-white"
          style={{
            backgroundImage: 'url("/images/pnc-bg.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '80px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <h2 className="text-xl font-semibold">ADDING ROOM</h2>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
          <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="mb-2">Building:</div>
            <select
              className="w-full p-2 border rounded"
              value={newRoom.building_id}
              onChange={handleBuildingChange}
            >
              <option value="">Select Building</option>
              {buildings.map((building) => (
                <option key={building.value} value={building.value}>{building.label}</option>
              ))}
            </select>
          </div>
          <div>
            <div className="mb-2">Room Type:</div>
            <select 
              className="w-full p-2 border rounded" 
              value={newRoom.room_type} 
              onChange={handleRoomTypeChange}
              disabled={!newRoom.building_id} // Disable if no building is selected
            >
              <option value="">Select Room Type</option>
              {availableRoomTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

            <div>
              <div className="mb-2">Floor No.:</div>
              <input 
                type="number" 
                className="w-full p-2 border rounded"
                value={newRoom.floor_number} 
                onChange={(e) => setNewRoom({ ...newRoom, floor_number: e.target.value })} 
              />
            </div>

            <div>
                <div className="mb-2">Room No.:</div>
                <input
                  type="text"
                  className="w-full p-2 border rounded bg-gray-200"
                  value={newRoom.room_number}
                  readOnly
                  placeholder={newRoom.building_id && newRoom.room_type ? "Loading..." : "Select building and room type first"}
                />
              </div>
            <div>
              <div className="mb-2">Status:</div>
              <select 
                className="w-full p-2 border rounded" 
                value={newRoom.status} 
                onChange={(e) => setNewRoom({ ...newRoom, status: e.target.value })}
              >
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Out of Order">Out of Order</option>
              </select>
            </div>

            <div>
              <div className="mb-2">Department:</div>
              <select 
                className="w-full p-2 border rounded" 
                value={newRoom.department} 
                onChange={(e) => setNewRoom({ ...newRoom, department: e.target.value })} 
                disabled={newRoom.status !== "Occupied"}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.value} value={dept.value}>{dept.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Close
            </Button>
            <Button 
              onClick={handleSaveRoom} 
              className="bg-green-700 hover:bg-green-600 text-white"
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
      {/* ✅ Edit Room Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} className="max-w-[700px] m-4">
        {/* Header with background image */}
        <div 
          className="bg-cover bg-center p-4 rounded-t-lg text-white"
          style={{
            backgroundImage: 'url("/images/pnc-bg.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '80px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <h2 className="text-xl font-semibold">
            Edit Room {selectedRoom && `- ${selectedRoom.room_number}`}
          </h2>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label>Status:</label>
              <select className="w-full p-2 border rounded" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Out of Order">Out of Order</option>
              </select>
            </div>
            
            <div>
              <label>Department:</label>
              <select 
                className="w-full p-2 border rounded" 
                value={newDepartment} 
                onChange={(e) => setNewDepartment(e.target.value)} 
                disabled={newStatus !== "Occupied"}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.value} value={dept.value}>{dept.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Close
            </Button>
            <Button 
              onClick={handleSaveChanges} 
              className="bg-green-700 hover:bg-green-600 text-white"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RoomTable;