import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
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

  const [newDepartment, setNewDepartment] = useState<string>("");
  const [newRoom, setNewRoom] = useState({
    room_number: "",
    building_id: "",
    room_type: "",
    floor_number: "",
    status: "Available",
    department: "",
  });

  useEffect(() => {
    fetchRooms();
    fetchRoomOptions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [rooms, filterBuilding, filterDepartment, filterStatus, filterRoomType]);

  
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
    setIsAddModalOpen(true);
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

  // ✅ Handle Status Change in Dropdown
  const handleStatusChange = (room: Room, newStatus: string) => {
    setSelectedRoom(room);
    setNewStatus(newStatus);
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

  // ✅ Get border color for dropdown
  const getBorderColor = (status: string): string => {
    if (status === "Available") return "border-2 border-green-600";
    if (status === "Occupied") return "border-2 border-yellow-600";
    if (status === "Out of Order") return "border-2 border-red-600";
    return "border-2 border-gray-300";
  };

  const fetchLatestRoomNumber = async (buildingId: string) => {
    if (!buildingId) return;
    try {
      const { data } = await axios.get(`http://localhost:3001/api/rooms/latest-room/${buildingId}`);
      setNewRoom((prevRoom) => ({ ...prevRoom, room_number: data.room_number }));
    } catch (error) {
      console.error("Error fetching latest room number:", error);
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
  };
  
  return (
    <div>
        <div className="flex items-center justify-between w-full mb-4">
          {/* Filters (Left Side) */}
          <div className="flex flex-wrap gap-x-4">
            {/* Building Filter */}
            <select
              className="p-2 border rounded"
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
              className="p-2 border rounded"
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
              className="p-2 border rounded"
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
              className="p-2 border rounded"
              value={filterRoomType}
              onChange={(e) => setFilterRoomType(e.target.value)}
            >
              <option value="">All Room Types</option>
              <option value="Lecture Room">Lecture Room</option>
              <option value="Laboratory">Laboratory</option>
              <option value="GYM">GYM</option>
            </select>
          </div>

          {/* ADD ROOM Button (Right Side) */}
          <Button onClick={handleAddRoom} className="bg-green-600 text-white ml-auto">
            ADD ROOM
          </Button>
        </div>


      {filteredRooms.length === 0 ? (
        <p className="text-center text-gray-600">No rooms available.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>ROOM #</TableCell>
              <TableCell>BUILDING</TableCell>
              <TableCell>TYPE</TableCell>
              <TableCell>STATUS</TableCell>
              <TableCell>DEPARTMENT</TableCell>
              <TableCell>FLOOR</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell>{room.room_number}</TableCell>
                <TableCell>{room.building}</TableCell>
                <TableCell>{room.type}</TableCell>
                <TableCell>
                  <select
                    className={`p-2 rounded w-full ${getBorderColor(room.status)}`}
                    value={room.status}
                    onChange={(e) => handleStatusChange(room, e.target.value)}
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Out of Order">Out of Order</option>
                  </select>
                </TableCell>
                <TableCell>{room.status === "Occupied" ? room.department || "-" : "-"}</TableCell>
                <TableCell>{room.floor}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

       {/* ✅ Add Room Modal */}
       <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <div className="p-6 max-w-lg mx-auto bg-white rounded shadow-lg">
          <h2 className="text-lg font-bold mb-4 text-center bg-green-600 text-white p-2 rounded">ADDING ROOM</h2>

          <label>Building:</label>
            <select
              className="p-2 border rounded w-full"
              value={newRoom.building_id}
              onChange={(e) => {
                setNewRoom({ ...newRoom, building_id: e.target.value });
                fetchLatestRoomNumber(e.target.value);
              }}
            >
              <option value="">Select Building</option>
              {buildings.map((building) => (
                <option key={building.value} value={building.value}>{building.label}</option>
              ))}
            </select>

          <label>Room Type:</label>
          <select className="p-2 border rounded w-full" value={newRoom.room_type} onChange={(e) => setNewRoom({ ...newRoom, room_type: e.target.value })}>
            <option value="">Select Room Type</option>
            <option value="Lecture Room">Lecture Room</option>
            <option value="Laboratory">Laboratory</option>
            <option value="GYM">GYM</option>
          </select>

          <label>Floor No.:</label>
          <input type="number" className="p-2 border rounded w-full" value={newRoom.floor_number} onChange={(e) => setNewRoom({ ...newRoom, floor_number: e.target.value })} />

          <label>Room No.:</label>
            <input
              type="text"
              className="p-2 border rounded w-full bg-gray-200"
              value={newRoom.room_number}
              readOnly
            />

          <label>Status:</label>
          <select className="p-2 border rounded w-full" value={newRoom.status} onChange={(e) => setNewRoom({ ...newRoom, status: e.target.value })}>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Out of Order">Out of Order</option>
          </select>

          <label>Department:</label>
          <select className="p-2 border rounded w-full" value={newRoom.department} onChange={(e) => setNewRoom({ ...newRoom, department: e.target.value })} disabled={newRoom.status !== "Occupied"}>
            <option value="">Select Department</option>
            {departments.map((dept) => <option key={dept.value} value={dept.value}>{dept.label}</option>)}
          </select>

          <Button onClick={handleSaveRoom} className="bg-green-600 text-white mt-4 w-full">Save</Button>
        </div>
      </Modal>

      {/* ✅ Edit Room Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <div className="p-6 max-w-lg mx-auto bg-white rounded shadow-lg">
          <h2 className="text-lg font-bold mb-4 text-center">Edit Room</h2>
          <label>Status:</label>
          <select className="p-2 border rounded w-full" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Out of Order">Out of Order</option>
          </select>
          <label>Department:</label>
          <select className="p-2 border rounded w-full" value={newDepartment} onChange={(e) => setNewDepartment(e.target.value)} disabled={newStatus !== "Occupied"}>
            {departments.map((dept) => <option key={dept.value} value={dept.value}>{dept.label}</option>)}
          </select>
          <Button onClick={handleSaveChanges} className="bg-green-600 text-white mt-4">Save Changes</Button>
        </div>
      </Modal>
    </div>
  );
};

export default RoomTable;