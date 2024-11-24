import React, { useState } from 'react';
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane
} from 'mdb-react-ui-kit';
import Electronics from '../HomePage/Electronics';
import Clothing from '../HomePage/Clothing';
import SportsandOutdoors from '../HomePage/SportsandOutdoors';
import AllProducts from '../HomePage/AllProducts';

export default function App() {
  const [basicActive, setBasicActive] = useState('All');

  function handleBasicClick(value) {
    if (value === basicActive) {
      return;
    }

    setBasicActive(value);
  }

  return (
    <>
      <div className="d-flex justify-content-center mb-4">
        <MDBTabs pills className="custom-tabs">
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => handleBasicClick('All')}
              active={basicActive === 'All'}
              className={`custom-tab-link ${basicActive === 'All' ? 'active-tab' : ''}`}
            >
              All
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => handleBasicClick('Electronics')}
              active={basicActive === 'Electronics'}
              className={`custom-tab-link ${basicActive === 'Electronics' ? 'active-tab' : ''}`}
            >
              Electronics
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => handleBasicClick('Clothing')}
              active={basicActive === 'Clothing'}
              className={`custom-tab-link ${basicActive === 'Clothing' ? 'active-tab' : ''}`}
            >
              Clothing
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => handleBasicClick('Sports & Outdoors')}
              active={basicActive === 'Sports & Outdoors'}
              className={`custom-tab-link ${basicActive === 'Sports & Outdoors' ? 'active-tab' : ''}`}
            >
              Sports & Outdoors
            </MDBTabsLink>
          </MDBTabsItem>
        </MDBTabs>
      </div>

      <MDBTabsContent>
        <MDBTabsPane open={basicActive === 'All'}><div><AllProducts /></div></MDBTabsPane>
        <MDBTabsPane open={basicActive === 'Electronics'}><div><Electronics /></div></MDBTabsPane>
        <MDBTabsPane open={basicActive === 'Clothing'}><div><Clothing /></div></MDBTabsPane>
        <MDBTabsPane open={basicActive === 'Sports & Outdoors'}><div><SportsandOutdoors /></div></MDBTabsPane>
      </MDBTabsContent>

      <style jsx>{`
        .custom-tabs {
          font-family: 'Poppins', sans-serif; /* Unique modern font */
          font-size: 18px;
          gap: 15px; /* Add spacing between tabs */
        }

        .custom-tab-link {
          padding: 12px 24px; /* More spacious padding */
          border-radius: 20px; /* Rounded tabs */
          color: #333; /* Neutral text color */
          text-transform: uppercase;
          font-weight: 500;
          transition: all 0.3s ease; /* Smooth transition effect */
        }

      
        .active-tab {
          color: #fff; /* White text for active */
          background: #green; /* Unique green background for active */
          font-weight: 700; /* Bold active tab */
        }
      `}</style>
    </>
  );
}
