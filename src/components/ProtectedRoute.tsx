import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchLookups } from "../store/slices/lookupsSlice";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const lookupsLoaded = useAppSelector((state) => state.lookups.data !== null);

  useEffect(() => {
    if (!lookupsLoaded) {
      dispatch(fetchLookups());
    }
  }, [dispatch, lookupsLoaded]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
