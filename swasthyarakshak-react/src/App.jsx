import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import './index.css';

// Dashboard
import Dashboard from './pages/Dashboard';

// Health Trackers
import BPTracker from './pages/trackers/BPTracker';
import SugarTracker from './pages/trackers/SugarTracker';
import SpO2 from './pages/trackers/SpO2';
import WaterIntake from './pages/trackers/WaterIntake';
import SleepMonitor from './pages/trackers/SleepMonitor';
import StepCounter from './pages/trackers/StepCounter';
import BMICalculator from './pages/trackers/BMICalculator';
import MoodJournal from './pages/trackers/MoodJournal';
import WomenHealth from './pages/trackers/WomenHealth';
import Vaccination from './pages/trackers/Vaccination';

// Emergency
import MedicalID from './pages/emergency/MedicalID';
import VoiceSOS from './pages/emergency/VoiceSOS';
import OfflineSOS from './pages/emergency/OfflineSOS';
import Ambulance from './pages/emergency/Ambulance';
import FallDetection from './pages/emergency/FallDetection';
import CrashDetection from './pages/emergency/CrashDetection';
import EmergencyQR from './pages/emergency/EmergencyQR';
import SafeZone from './pages/emergency/SafeZone';
import AmbulanceTracking from './pages/emergency/AmbulanceTracking';

// AI & Smart
import SymptomChecker from './pages/ai/SymptomChecker';
import MedInteraction from './pages/ai/MedInteraction';
import AIRisk from './pages/ai/AIRisk';
import AIDiet from './pages/ai/AIDiet';
import AIWorkout from './pages/ai/AIWorkout';
import VoiceNotes from './pages/ai/VoiceNotes';
import FakeMedicine from './pages/ai/FakeMedicine';
import VoiceAssistant from './pages/ai/VoiceAssistant';
import AIReport from './pages/ai/AIReport';

// Family & Community
import FamilyDashboard from './pages/family/FamilyDashboard';
import BloodDonor from './pages/family/BloodDonor';
import HealthTimeline from './pages/family/HealthTimeline';
import HealthChallenges from './pages/family/HealthChallenges';

// Health Services
import LabBooking from './pages/services/LabBooking';
import HomeNurse from './pages/services/HomeNurse';
import MedicineAvailability from './pages/services/MedicineAvailability';

// Rural
import RuralMode from './pages/rural/RuralMode';
import ASHAWorker from './pages/rural/ASHAWorker';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />

          {/* Health Trackers */}
          <Route path="/bp-tracker"       element={<BPTracker />} />
          <Route path="/sugar-tracker"    element={<SugarTracker />} />
          <Route path="/spo2"             element={<SpO2 />} />
          <Route path="/water-intake"     element={<WaterIntake />} />
          <Route path="/sleep-monitor"    element={<SleepMonitor />} />
          <Route path="/step-counter"     element={<StepCounter />} />
          <Route path="/bmi-calculator"   element={<BMICalculator />} />
          <Route path="/mood-journal"     element={<MoodJournal />} />
          <Route path="/women-health"     element={<WomenHealth />} />
          <Route path="/vaccination"      element={<Vaccination />} />

          {/* Emergency */}
          <Route path="/medical-id"           element={<MedicalID />} />
          <Route path="/voice-sos"            element={<VoiceSOS />} />
          <Route path="/offline-sos"          element={<OfflineSOS />} />
          <Route path="/ambulance"            element={<Ambulance />} />
          <Route path="/fall-detection"       element={<FallDetection />} />
          <Route path="/crash-detection"      element={<CrashDetection />} />
          <Route path="/emergency-qr"         element={<EmergencyQR />} />
          <Route path="/safe-zone"            element={<SafeZone />} />
          <Route path="/ambulance-tracking"   element={<AmbulanceTracking />} />

          {/* AI & Smart */}
          <Route path="/symptom-checker"  element={<SymptomChecker />} />
          <Route path="/med-interaction"  element={<MedInteraction />} />
          <Route path="/ai-risk"          element={<AIRisk />} />
          <Route path="/ai-diet"          element={<AIDiet />} />
          <Route path="/ai-workout"       element={<AIWorkout />} />
          <Route path="/voice-notes"      element={<VoiceNotes />} />
          <Route path="/fake-medicine"    element={<FakeMedicine />} />
          <Route path="/voice-assistant"  element={<VoiceAssistant />} />
          <Route path="/ai-report"        element={<AIReport />} />

          {/* Family */}
          <Route path="/family-dashboard"   element={<FamilyDashboard />} />
          <Route path="/blood-donor"        element={<BloodDonor />} />
          <Route path="/health-timeline"    element={<HealthTimeline />} />
          <Route path="/health-challenges"  element={<HealthChallenges />} />

          {/* Health Services */}
          <Route path="/lab-booking"             element={<LabBooking />} />
          <Route path="/home-nurse"              element={<HomeNurse />} />
          <Route path="/medicine-availability"   element={<MedicineAvailability />} />

          {/* Rural */}
          <Route path="/rural-mode"    element={<RuralMode />} />
          <Route path="/asha-worker"   element={<ASHAWorker />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
