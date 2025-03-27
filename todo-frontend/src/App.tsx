import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import { Sonner } from "./components/ui";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  return (
    <ErrorBoundary>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
