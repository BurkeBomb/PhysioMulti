<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route
    path="/app"
    element={
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    }
  />
  <Route path="*" element={<Navigate to="/app" replace />} />
</Routes>
