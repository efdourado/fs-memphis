import React, { useState, useEffect, useCallback } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSyncAlt } from "@fortawesome/free-solid-svg-icons";

import * as collectionService from '../../services/collectionService';
import * as adminService from '../../services/adminService';

import LoadingSpinner from '../../components/ui/LoadingSpinner';
import AdminTable from './components/AdminTable';
import AdminEditModal from './components/AdminEditModal';

const TABS = {
  artists: { label: 'Artists', fetch: collectionService.fetchArtists, delete: adminService.deleteArtist },
  albums: { label: 'Albums', fetch: collectionService.fetchAlbums, delete: adminService.deleteAlbum },
  songs: { label: 'Songs', fetch: collectionService.fetchSongs, delete: adminService.deleteSong },
  users: { label: 'Users', fetch: adminService.fetchUsers, delete: adminService.deleteUser },
};

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('artists');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalState, setModalState] = useState({ isOpen: false, item: null });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const fetchData = TABS[activeTab].fetch;
      const { data } = await fetchData();
      setData(data || []);
    } catch (err) {
      setError(`Failed to fetch ${activeTab}.`);
      console.error(err);
    } finally {
      setLoading(false);
  } }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenModal = (item = null) => {
    setModalState({ isOpen: true, item: item });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, item: null });
  };
  
  const handleSaveAndReload = () => {
      loadData();
      handleCloseModal();
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`);
    if (confirmDelete) {
      try {
        const deleteFn = TABS[activeTab].delete;
        await deleteFn(id);
        loadData();
      } catch (err) {
        setError(`Failed to delete ${activeTab.slice(0, -1)}.`);
        console.error(err);
  } } };

  const handleDashboardCycle = () => {
    const tabKeys = Object.keys(TABS);
    const currentIndex = tabKeys.indexOf(activeTab);
    const nextIndex = (currentIndex + 1) % tabKeys.length;
    const nextTab = tabKeys[nextIndex];
    setActiveTab(nextTab);
  };

  const currentType = activeTab.slice(0, -1);

  return (
    <div className="admin-page-unified">
      <div className="admin-header">
        
        <button className="login-btn create-btn" onClick={handleDashboardCycle}>
          {TABS[activeTab].label} Dashboard
          <FontAwesomeIcon icon={faSyncAlt} className="btn-icon-graphic" style={{ marginLeft: '8px' }}/>
        </button>
        
        <button onClick={() => handleOpenModal()} className="login-btn create-btn">
          <FontAwesomeIcon icon={faPlus} className="btn-icon-graphic" />
          <span className="btn-label"> Add New {currentType}</span>
        </button>
      </div>

      <div className="admin-content-area">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <AdminTable
            type={activeTab}
            data={data}
            handleDelete={handleDelete}
            handleEdit={handleOpenModal}
          />
        )}
      </div>

       <AdminEditModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        item={modalState.item}
        type={currentType}
        onSaved={handleSaveAndReload}
      />
    </div>
); };

export default AdminPage;