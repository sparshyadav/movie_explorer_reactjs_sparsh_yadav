import React from 'react';
import { useParams } from 'react-router-dom';

const AddMovieWrapper = (WrappedComponent: React.ComponentType<{ id?: string }>) => {
    const ComponentWithParams = () => {
        const { id } = useParams<{ id: string }>();
        return <WrappedComponent id={id} />;
    };

    return ComponentWithParams;
};

export default AddMovieWrapper;
