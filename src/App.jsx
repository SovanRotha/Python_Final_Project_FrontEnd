import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import UserSideBar from './shared/components/UserSideBar';
import Home from './screen/userScreen/home';
import Explore from './screen/userScreen/explore';
import Saved from './screen/userScreen/saved';
import Trip from './screen/userScreen/trip';
import Budget from './screen/userScreen/budget';
import AIAssistant from './screen/userScreen/ai_assistant';
import Notification from './screen/userScreen/notification';
import PlacePage from './features/discovery/page/PlacePage';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import { AuthProvider } from './app/providers/AuthProviders';
import { useAuth } from './app/providers/authContext.js';
import savedPlaceApi from './services/api/saved_api.js';

function ProtectedPage({ children }) {
  const { accessToken } = useAuth();
  const location = useLocation();
  return accessToken ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}

function UserPage() {
  const { accessToken, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [savedPlaceRecords, setSavedPlaceRecords] = useState([]);
  const [savedPlacesLoadedKey, setSavedPlacesLoadedKey] = useState('');
  const [savedPlacesError, setSavedPlacesError] = useState('');
  const [savingPlaceIds, setSavingPlaceIds] = useState([]);
  const [savedPlacesReloadKey, setSavedPlacesReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    if (!accessToken) return undefined;
    const loadKey = `${accessToken}:${savedPlacesReloadKey}`;

    async function loadSavedPlaces() {
      try {
        const records = await savedPlaceApi.list();
        if (cancelled) return;
        setSavedPlaceRecords(records);
        setSavedPlaces(records.map((record) => record.place_id));
        setSavedPlacesError('');
      } catch (error) {
        if (cancelled) return;
        console.error('Could not load saved places:', error);
        setSavedPlaceRecords([]);
        setSavedPlaces([]);
        setSavedPlacesError(
          error instanceof Error ? error.message : 'Could not load saved places.',
        );
      } finally {
        if (!cancelled) setSavedPlacesLoadedKey(loadKey);
      }
    }

    void loadSavedPlaces();
    return () => {
      cancelled = true;
    };
  }, [accessToken, savedPlacesReloadKey]);

  const savedPlacesLoading = Boolean(
    accessToken &&
      savedPlacesLoadedKey !== `${accessToken}:${savedPlacesReloadKey}`,
  );

  const handleToggleSave = async (placeId) => {
    if (!accessToken) {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (
      savingPlaceIds.some(
        (savingId) => String(savingId) === String(placeId),
      )
    ) {
      return;
    }

    setSavingPlaceIds((current) => [...current, placeId]);
    setSavedPlacesError('');
    try {
      const savedRecord = savedPlaceRecords.find(
        (record) => String(record.place_id) === String(placeId),
      );
      if (savedRecord) {
        await savedPlaceApi.remove(savedRecord.id);
        setSavedPlaceRecords((current) =>
          current.filter((record) => record.id !== savedRecord.id),
        );
        setSavedPlaces((current) =>
          current.filter((id) => String(id) !== String(placeId)),
        );
      } else {
        const record = await savedPlaceApi.save(placeId);
        setSavedPlaceRecords((current) => [...current, record]);
        setSavedPlaces((current) =>
          current.some((id) => String(id) === String(placeId))
            ? current
            : [...current, record.place_id],
        );
      }
    } catch (error) {
      console.error('Could not update saved places:', error);
      setSavedPlacesError(
        error instanceof Error ? error.message : 'Could not update saved places.',
      );
    } finally {
      setSavingPlaceIds((current) =>
        current.filter((id) => String(id) !== String(placeId)),
      );
    }
  };

  return (
    <div className="flex h-dvh overflow-hidden bg-slate-50">
      <UserSideBar
        onSignOut={signOut}
        isSignedIn={Boolean(accessToken)}
      />
      <main className="h-full min-w-0 flex-1 overflow-y-auto pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
        {accessToken && savedPlacesError && (
          <div
            className="mx-4 mt-4 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 md:mx-8"
            role="alert"
          >
            <span>{savedPlacesError}</span>
            <button
              aria-label="Dismiss saved places error"
              className="font-semibold"
              onClick={() => {
                setSavedPlacesError('');
                setSavedPlacesLoadedKey('');
                setSavedPlacesReloadKey((key) => key + 1);
              }}
              type="button"
            >
              Retry
            </button>
          </div>
        )}
        <Routes>
          <Route
            path="/"
            element={
              <Home
                savedPlaces={savedPlaces}
                onToggleSave={handleToggleSave}
                canSavePlaces={!savedPlacesLoading && !savedPlacesError}
                savingPlaceIds={savingPlaceIds}
              />
            }
          />
          <Route
            path="/explore"
            element={
              <Explore
                savedPlaces={savedPlaces}
                onToggleSave={handleToggleSave}
                canSavePlaces={!savedPlacesLoading && !savedPlacesError}
                savingPlaceIds={savingPlaceIds}
              />
            }
          />
          <Route
            path="/places/:placeId"
            element={
              <PlacePage
                savedPlaces={savedPlaces}
                onToggleSave={handleToggleSave}
                canSavePlaces={!savedPlacesLoading && !savedPlacesError}
                savingPlaceIds={savingPlaceIds}
              />
            }
          />
          <Route
            path="/saved"
            element={
              <ProtectedPage>
                <Saved
                  savedPlaces={savedPlaces}
                  onToggleSave={handleToggleSave}
                  savingPlaceIds={savingPlaceIds}
                  savedPlacesLoading={savedPlacesLoading}
                  savedPlacesError={savedPlacesError}
                />
              </ProtectedPage>
            }
          />
          <Route
            path="/trips"
            element={
              <ProtectedPage>
                <Trip />
              </ProtectedPage>
            }
          />
          <Route
            path="/login"
            element={
              accessToken ? (
                <Navigate
                  to={location.state?.from?.pathname || '/'}
                  replace
                  state={location.state?.from?.state}
                />
              ) : (
                <LoginPage />
              )
            }
          />
          <Route
            path="/register"
            element={
              accessToken ? (
                <Navigate
                  to={location.state?.from?.pathname || '/'}
                  replace
                  state={location.state?.from?.state}
                />
              ) : (
                <RegisterPage />
              )
            }
          />
          <Route
            path="/budget"
            element={
              <ProtectedPage>
                <Budget />
              </ProtectedPage>
            }
          />
          <Route
            path="/ai"
            element={
              <ProtectedPage>
                <AIAssistant />
              </ProtectedPage>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedPage>
                <Notification />
              </ProtectedPage>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <UserPage />
    </AuthProvider>
  );
}