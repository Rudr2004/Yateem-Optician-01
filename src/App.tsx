import { HashRouter, Routes, Route } from "react-router-dom";
import { MobileDeviceFrame } from "./components/MobileDeviceFrame";
import { AppStateProvider } from "./state/AppStateContext";
import { ThemeProvider } from "./state/ThemeContext";
import { ToastProvider } from "./components/Toast";

import { HomeScreen } from "./screens/HomeScreen";
import { CustomerDetailsScreen } from "./screens/CustomerDetailsScreen";
import { CustomersScreen } from "./screens/CustomersScreen";
import { FrameSelectionScreen } from "./screens/FrameSelectionScreen";
import { MeasurementIntroScreen } from "./screens/MeasurementIntroScreen";
import { CalibrationScreen } from "./screens/CalibrationScreen";
import { MeasurementResultsScreen } from "./screens/MeasurementResultsScreen";
import { RecentFittingsScreen } from "./screens/RecentFittingsScreen";
import { FittingDetailScreen } from "./screens/FittingDetailScreen";
import { MeasurementValidationScreen } from "./screens/MeasurementValidationScreen";
import { LensTypeScreen } from "./screens/LensTypeScreen";
import { CoatingsScreen } from "./screens/CoatingsScreen";
import { ThicknessScreen } from "./screens/ThicknessScreen";
import { TintScreen } from "./screens/TintScreen";
import { FinalReviewScreen } from "./screens/FinalReviewScreen";
import { ReportScreen } from "./screens/ReportScreen";
import { ShareScreen } from "./screens/ShareScreen";
import { SuccessScreen } from "./screens/SuccessScreen";
import { MoreScreen } from "./screens/MoreScreen";
import { SettingsScreen } from "./screens/SettingsScreen";

function App() {
  return (
    <ThemeProvider>
      <AppStateProvider>
        <HashRouter>
          <MobileDeviceFrame>
            <ToastProvider>
              <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/customer" element={<CustomerDetailsScreen />} />
                <Route path="/customers" element={<CustomersScreen />} />
                <Route path="/frame-selection" element={<FrameSelectionScreen />} />
                <Route path="/measure/intro" element={<MeasurementIntroScreen />} />
                <Route path="/measure/calibrate" element={<CalibrationScreen />} />
                <Route path="/measure/results" element={<MeasurementResultsScreen />} />
                <Route path="/measure/recent" element={<RecentFittingsScreen />} />
                <Route path="/measure/recent/:id" element={<FittingDetailScreen />} />
                <Route path="/measure/validation" element={<MeasurementValidationScreen />} />
                <Route path="/lens" element={<LensTypeScreen />} />
                <Route path="/coatings" element={<CoatingsScreen />} />
                <Route path="/thickness" element={<ThicknessScreen />} />
                <Route path="/tint" element={<TintScreen />} />
                <Route path="/review" element={<FinalReviewScreen />} />
                <Route path="/report" element={<ReportScreen />} />
                <Route path="/share" element={<ShareScreen />} />
                <Route path="/success" element={<SuccessScreen />} />
                <Route path="/more" element={<MoreScreen />} />
                <Route path="/settings" element={<SettingsScreen />} />
                <Route path="*" element={<HomeScreen />} />
              </Routes>
            </ToastProvider>
          </MobileDeviceFrame>
        </HashRouter>
      </AppStateProvider>
    </ThemeProvider>
  );
}

export default App;
