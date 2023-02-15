import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function HelmetSEO({ title, description, type, img }) {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name='description' content={description} />

            <meta property='og:site_name' content="Sammy's Store" />
            <meta property='og:type' content={type} />
            <meta property='og:title' content={title} />
            <meta property='og:image' content={img} />
            <meta property='og:description' content={description} />

        </Helmet>
    )
}
