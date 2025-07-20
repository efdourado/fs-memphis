import React, { useState, useEffect, useCallback } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSyncAlt } from "@fortawesome/free-solid-svg-icons";

import * as adminService from '../../services/adminService';
import * as collectionService from '../../services/collectionService';

import AdminForm from './components/AdminForm';
import AdminModal from './components/AdminModal';
import AdminTable from './components/AdminTable';

import { albumFormConfig } from './components/formConfigs/albumFormConfig';
import { songFormConfig } from './components/formConfigs/songFormConfig';
import { userFormConfig } from './components/formConfigs/userFormConfig';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const TABS = {
  users: { label: 'Users', fetch: adminService.fetchUsers, delete: adminService.deleteUser, config: userFormConfig },
  albums: { label: 'Albums', fetch: collectionService.fetchAlbums, delete: adminService.deleteAlbum, config: albumFormConfig },
  songs: { label: 'Songs', fetch: collectionService.fetchSongs, delete: adminService.deleteSong, config: songFormConfig },
};

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await TABS[activeTab].fetch();
      setData(data || []);
    } catch (err) {
      setError(`Failed to fetch ${activeTab}. Please try again.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSaveAndReload = () => {
    handleCloseModal();
    loadData();
  };

  const handleDelete = async (id) => {
    const currentTypeName = activeTab.slice(0, -1);
    if (window.confirm(`Are you sure you want to delete this ${currentTypeName}? This action cannot be undone.`)) {
      try {
        await TABS[active-tab].delete(id);
        loadData();
      } catch (err) {
        setError(`Failed to delete ${currentTypeName}.`);
        console.error(err);
  } } };
  
  const handleDashboardCycle = () => {
    const tabKeys = Object.keys(TABS);
    const currentIndex = tabKeys.indexOf(activeTab);
    const nextIndex = (currentIndex + 1) % tabKeys.length;
    setActiveTab(tabKeys[nextIndex]);
  };

  const currentTabConfig = TABS[activeTab];
  const currentTypeName = activeTab.slice(0, -1);
  const modalTitle = `${editingItem ? 'Update' : 'Create'} ${ currentTypeName }`;

  return (
    <div className="admin-page-unified">
      <div className="admin-header">
        <button className="login-btn create-btn" onClick={handleDashboardCycle}>
          {currentTabConfig.label} Dashboard
          <FontAwesomeIcon icon={faSyncAlt} className="btn-icon-graphic" style={{ marginLeft: '8px' }}/>
        </button>

        <button onClick={() => handleOpenModal()} className="login-btn create-btn">
          <FontAwesomeIcon icon={faPlus} className="btn-icon-graphic" />
          <span className="btn-label"> Add New {currentTypeName}</span>
        </button>
      </div>

      <div className="admin-content-area">
        {error && <p className="error-message">{error}</p>}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <AdminTable type={activeTab} data={data} handleDelete={handleDelete} handleEdit={handleOpenModal} />
        )}
      </div>

      {isModalOpen && (
        <AdminModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={modalTitle}
          FormComponent={AdminForm}
          formProps={{
            id: editingItem ? editingItem._id : null,
            config: currentTabConfig.config,
            onSaved: handleSaveAndReload,
            onCancel: handleCloseModal,
          }}
        />
      )}
    </div>
); };

export default AdminPage;