import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import UsersTable from "../../components/users/UsersTable";
import {
  UserTypeModal,
  CreateAdminModal,
  CreateDeanChairModal,
  EditAdminModal,
  EditDeanChairModal,
  CreateProfessorAccountModal,
  EditProfessorModal,
} from "../../components/users/UserModals";
import Button from "../../components/ui/button/Button";

interface UserEntry {
  user_id: number;
  full_name: string | null;
  email: string | null;
  department: string | null;
  faculty_type: string | null;
  position: string | null;
  role: "ADMIN" | "USER" | null;
  status: "ACTIVE" | "INACTIVE" | null;
  password?: string | null;
}

export default function Users() {
  const [reloadTable, setReloadTable] = useState(false);

  // Modal states
  const [showUserTypeModal, setShowUserTypeModal] = useState(false);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [showCreateDeanChair, setShowCreateDeanChair] = useState(false);
  const [showEditAdmin, setShowEditAdmin] = useState(false);
  const [showEditDeanChair, setShowEditDeanChair] = useState(false);
  const [showCreateProfessor, setShowCreateProfessor] = useState(false);
  const [showEditProfessor, setShowEditProfessor] = useState(false);

  // Currently selected user (for edit)
  const [selectedUser, setSelectedUser] = useState<UserEntry | null>(null);

  const handleUserTypeSelection = (type: "admin" | "deanchair") => {
    setShowUserTypeModal(false);
    
    if (type === "admin") {
      setShowCreateAdmin(true);
    } else {
      setShowCreateDeanChair(true);
    }
  };

  const handleCreateSuccess = () => {
    setReloadTable((prev) => !prev);
  };

  const handleEditAdmin = (user: UserEntry) => {
    setSelectedUser(user);
    setShowEditAdmin(true);
  };

  // const handleEditDeanChair = (user: UserEntry) => {
  //   setSelectedUser(user);
  //   setShowEditDeanChair(true);
  // };

  const handleCreateProfessorAccount = (user: UserEntry) => {
    setSelectedUser(user);
    setShowCreateProfessor(true);
  };

  const handleEditProfessor = (user: UserEntry) => {
    setSelectedUser(user);
    setShowEditProfessor(true);
  };

  return (
    <>
      <PageMeta
        title="Users | iUCSchedProMax+"
        description="Users page for iUCSchedProMax+"
      />
      <PageBreadcrumb
        pageTitle="Users"
        segments={[
          { name: "Home", path: "/dashboard" },
          { name: "Users", path: "/users" },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          {/* Search / Filter inputs */}
        </div>
        <div>
          <Button 
            variant="primary" 
            size="md" 
            onClick={() => setShowUserTypeModal(true)}
          >
            Add User
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <UsersTable
          reload={reloadTable}
          onEditAdmin={handleEditAdmin}
          // onEditDeanChair={handleEditDeanChair}
          onCreateProfessorAccount={handleCreateProfessorAccount}
          onEditProfessor={handleEditProfessor}
        />
      </div>

      {/* USER TYPE SELECTION MODAL */}
      <UserTypeModal
        isOpen={showUserTypeModal}
        onClose={() => setShowUserTypeModal(false)}
        onSelectType={handleUserTypeSelection}
      />

      {/* CREATE ADMIN MODAL */}
      <CreateAdminModal
        isOpen={showCreateAdmin}
        onClose={() => setShowCreateAdmin(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* CREATE DEAN/CHAIR MODAL */}
      <CreateDeanChairModal
        isOpen={showCreateDeanChair}
        onClose={() => setShowCreateDeanChair(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* EDIT ADMIN MODAL */}
      <EditAdminModal
        isOpen={showEditAdmin}
        onClose={() => setShowEditAdmin(false)}
        user={selectedUser}
        onSuccess={() => setReloadTable((prev) => !prev)}
      />

      {/* EDIT DEAN/CHAIR MODAL */}
      <EditDeanChairModal
        isOpen={showEditDeanChair}
        onClose={() => setShowEditDeanChair(false)}
        user={selectedUser}
        onSuccess={() => setReloadTable((prev) => !prev)}
      />

      {/* CREATE PROFESSOR ACCOUNT MODAL */}
      <CreateProfessorAccountModal
        isOpen={showCreateProfessor}
        onClose={() => setShowCreateProfessor(false)}
        user={selectedUser}
        onSuccess={() => setReloadTable((prev) => !prev)}
      />

      {/* EDIT PROFESSOR MODAL */}
      <EditProfessorModal
        isOpen={showEditProfessor}
        onClose={() => setShowEditProfessor(false)}
        user={selectedUser}
        onSuccess={() => setReloadTable((prev) => !prev)}
      />
    </>
  );
}