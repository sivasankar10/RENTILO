/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Home from './pages/Home/Home';
import Auth from './pages/Auth/Auth';
import Otp from './pages/Otp/Otp';
import PropertyListings from './pages/PropertyListings/PropertyListings';
import PropertyDetails from './pages/PropertyDetails/PropertyDetails';
import SavedProperties from './pages/SavedProperties/SavedProperties';
import EditProfile from './pages/EditProfile/EditProfile';

type Page =
  | 'home'
  | 'auth'
  | 'otp'
  | 'listings'
  | 'property-details'
  | 'saved-properties'
  | 'edit-profile'
  | 'tenant-dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>([]);

  const toggleSavedProperty = (id: string) => {
    setSavedPropertyIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const saveAndGoToSaved = (id: string) => {
    setSavedPropertyIds((prev) =>
      prev.includes(id) ? prev : [...prev, id]
    );
    setCurrentPage('saved-properties');
  };

  const openPropertyDetails = (id: string) => {
    setSelectedPropertyId(id);
    setCurrentPage('property-details');
  };

  return (
    <div className="app-container">
      {currentPage === 'home' ? (
        <Home onAuthClick={() => setCurrentPage('auth')} />
      ) : currentPage === 'auth' ? (
        <Auth onContinue={() => setCurrentPage('otp')} />
      ) : currentPage === 'otp' ? (
        <Otp
          onVerify={() => setCurrentPage('listings')}
          onChangeNumber={() => setCurrentPage('auth')}
        />
      ) : currentPage === 'listings' ? (
        <PropertyListings
          savedPropertyIds={savedPropertyIds}
          onToggleSaved={toggleSavedProperty}
          onSaveAndGoToSaved={saveAndGoToSaved}
          onNavigateHome={() => setCurrentPage('home')}
          onNavigateDashboard={() => setCurrentPage('tenant-dashboard')}
          onNavigateSaved={() => setCurrentPage('saved-properties')}
          onNavigateProfile={() => setCurrentPage('edit-profile')}
          onSelectProperty={openPropertyDetails}
        />
      ) : currentPage === 'saved-properties' ? (
        <SavedProperties
          savedPropertyIds={savedPropertyIds}
          onToggleSaved={toggleSavedProperty}
          onNavigateHome={() => setCurrentPage('home')}
          onNavigateListings={() => setCurrentPage('listings')}
          onNavigateDashboard={() => setCurrentPage('tenant-dashboard')}
          onNavigateSaved={() => setCurrentPage('saved-properties')}
          onNavigateProfile={() => setCurrentPage('edit-profile')}
          onSelectProperty={openPropertyDetails}
        />
      ) : currentPage === 'property-details' ? (
        <PropertyDetails
          propertyId={selectedPropertyId}
          savedPropertyIds={savedPropertyIds}
          onToggleSaved={toggleSavedProperty}
          onNavigateHome={() => setCurrentPage('home')}
          onNavigateListings={() => setCurrentPage('listings')}
          onNavigateDashboard={() => setCurrentPage('tenant-dashboard')}
          onNavigateSaved={() => setCurrentPage('saved-properties')}
          onNavigateProfile={() => setCurrentPage('edit-profile')}
        />
      ) : currentPage === 'edit-profile' ? (
        <EditProfile
          savedPropertyIds={savedPropertyIds}
          onNavigateHome={() => setCurrentPage('home')}
          onNavigateListings={() => setCurrentPage('listings')}
          onNavigateDashboard={() => setCurrentPage('tenant-dashboard')}
          onNavigateSaved={() => setCurrentPage('saved-properties')}
          onLogout={() => setCurrentPage('home')}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
