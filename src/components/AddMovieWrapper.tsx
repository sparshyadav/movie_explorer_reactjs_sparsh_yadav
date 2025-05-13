import React from 'react';
import { useNavigate, useParams, NavigateFunction } from 'react-router-dom';

interface WithRouterProps {
  id?: string;
  navigate: NavigateFunction;
}

const AddMovieWrapper = (WrappedComponent: React.ComponentType<WithRouterProps>) => {
  const ComponentWithParams = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    return <WrappedComponent id={id} navigate={navigate} />;
  };

  return ComponentWithParams;
};

export default AddMovieWrapper;
