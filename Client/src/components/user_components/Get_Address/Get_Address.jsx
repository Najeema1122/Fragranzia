import React, { useEffect, useState } from "react";
import UserService from "../../../Services/UserService";
import "./Get_Address.css";

const Get_Address = () => {

    const [address, setAddress] = useState([]);

    const { getAddress } = UserService();

    useEffect(() => {

        const fetchAddress = async () => {

            try {

                const response = await getAddress();

                console.log("address =====", response);

                setAddress(response.addresses || []);

            } catch (error) {

                console.log("Error getting address:", error);

            }

        };

        fetchAddress();

    }, []);

    // Find primary address
    const primaryAddress = address.find(
        (item) => item.isPrimary === true
    );

    return (
        <div className="delivery_address">

            <h2>Address</h2>

            {primaryAddress ? (

                <div className="primary_address_card">

                    <h3>
                        {primaryAddress.full_name}
                    </h3>

                    <p>
                        {primaryAddress.address}
                        {primaryAddress.district &&
                            `, ${primaryAddress.district}`}
                        {primaryAddress.state &&
                            `, ${primaryAddress.state}`}
                        {primaryAddress.pincode &&
                            ` - ${primaryAddress.pincode}`}
                    </p>

                    <p>
                        {primaryAddress.phone_number}
                    </p>

                </div>

            ) : (

                <p className="no_primary_address">
                    No primary address found.
                </p>

            )}

        </div>
    );
};

export default Get_Address;