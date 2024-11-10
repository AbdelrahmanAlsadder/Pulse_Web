import React, { useEffect, useState } from "react";

const Navdata = () => {
    //state data
    const [isInvoiceManagement, setIsInvoiceManagement] = useState(false);

    const [isAuthentication, setIsAuthentication] = useState(false);
    const [isPages, setIsPages] = useState(false);

    
    // Components

    const [isForms, setIsForms] = useState(false);



    const [isOrder, setIsOrder] = useState(false);
    
    const [isAuth, setIsAuth] = useState(false);


    const [iscurrentState, setIscurrentState] = useState('Dashboard');

    function updateIconSidebar(e: any) {
        if (e && e.target && e.target.getAttribute("sub-items")) {
            const ul: any = document.getElementById("two-column-menu");
            const iconItems: any = ul.querySelectorAll(".nav-icon.active");
            let activeIconItems = [...iconItems];
            activeIconItems.forEach((item) => {
                item.classList.remove("active");
                var id: any = item.getAttribute("sub-items");
                var menusId = document.getElementById(id);
                if (menusId){
                    (menusId.parentElement as HTMLElement).classList.remove("show");
                }
            });
            e.target.classList.add("active");
        }
    }
    useEffect(() => {
        document.body.classList.remove('twocolumn-panel');

        
        if (iscurrentState !== 'Invoice Management') {
            setIsInvoiceManagement(false);
        }
        
        if (iscurrentState !== 'Authentication') {
            setIsAuthentication(false);
        }
        if (iscurrentState !== 'Pages') {
            setIsPages(false);
        }

        if (iscurrentState !== 'Orders') {
            setIsOrder(false);
        }

        if (iscurrentState !== 'Auth') {
            setIsAuth(false);
        }
    }, [
        iscurrentState,       
        isInvoiceManagement,        
        isOrder,        
        isAuth,
        isAuthentication,
        isPages,  
        isForms,
    ]);

    const menuItems: any = [
        {
            label: "Menu",
            isHeader: true,
        },        
        {
            id: "dashboard",
            label: "Dashboard",
            icon: "las la-house-damage",
            link: "/dashboard",           

        },
        {
            label: "Pages",
            isHeader: true,
        },
        {
            id: "authentication",
            label: "Order Management",
            icon: "las la-cog",
            link: "/#",
            click: function (e: any) {
                e.preventDefault();
                setIsAuthentication(!isAuthentication);
                setIscurrentState('Authentication');
                updateIconSidebar(e);
            },
            stateVariables: isAuthentication,
            subItems: [
             
                {
                    id: "orders",
                    label: "Orders",
                    link: "/orders",
                    parentId: "authentication"
                },                 
            ],
        },
        {
            id: "forms",
            label: "Product Management",
            icon: "lab la-wpforms",
            link: "/#",
            click: function (e: any) {
                e.preventDefault();
                setIsForms(!isForms);
                setIscurrentState('Forms');
                updateIconSidebar(e);
            },
            stateVariables: isForms,
            subItems: [
                { id: 1, label: "Product List", link: "/product-list", parentId: "invoiceManagement" },                        
                { id: 2, label: "Add Product", link: "/product-add", parentId: "invoiceManagement" },    
            ],
        },
        
        {
            id: "invoiceManagement",
            label: "Invoice Management",
            icon: "las la-file-invoice",
            link: "/#",
            click: function (e: any) {
                e.preventDefault();
                setIsInvoiceManagement(!isInvoiceManagement);
                setIscurrentState('Invoice Management');
                updateIconSidebar(e);
            },
            stateVariables: isInvoiceManagement,
            subItems: [
                { id: 1, label: "Invoice", link: "/invoice", parentId: "invoiceManagement" },
                { id: 2, label: "Add Invoice", link: "/invoice-add", parentId: "invoiceManagement" },
               
            ],
        },

    ];
    return <React.Fragment>{menuItems}</React.Fragment>;
};

export default Navdata;