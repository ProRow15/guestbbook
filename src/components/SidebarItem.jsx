import React from 'react';

const SidebarItem = ({ label, icon }) => {
    return (
        <div className="sidebar-item">
            {icon && <span className="icon">{icon}</span>}
            <span className="label">{label}</span>
        </div>
    );
};

export default SidebarItem;