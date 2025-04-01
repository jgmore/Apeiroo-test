import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';

const renderWithAntd = (
    ui: React.ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
) =>
    render(ui, {
        wrapper: ({ children }) => (
            <ConfigProvider locale={enUS}>{children}</ConfigProvider>
        ),
        ...options,
    });

export default renderWithAntd;
