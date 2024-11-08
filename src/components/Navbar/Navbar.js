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

  function handleBasicClick(value: String ) {
    if (value === basicActive) {
      return;
    }

    setBasicActive(value);
  }

  return (
    <>
      <div className="d-flex justify-content-center mb-3"> {/* Center the tabs */}
        <MDBTabs pills>
          <MDBTabsItem>
            <MDBTabsLink onClick={() => handleBasicClick('All')} active={basicActive === 'All'}>
              All
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink onClick={() => handleBasicClick('Electronics')} active={basicActive === 'Electronics'}>
              Electronics
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink onClick={() => handleBasicClick('Clothing')} active={basicActive === 'Clothing'}>
              Clothing
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink onClick={() => handleBasicClick('Sports & Outdoors')} active={basicActive === 'Sports & Outdoors'}>
              Sports & Outdoors
            </MDBTabsLink>
          </MDBTabsItem>
        </MDBTabs>
      </div>

      <MDBTabsContent>
        <MDBTabsPane open={basicActive === 'All'}><div><AllProducts /></div></MDBTabsPane>
        <MDBTabsPane open={basicActive === 'Electronics'}><div><Electronics/></div></MDBTabsPane>
        <MDBTabsPane open={basicActive === 'Clothing'}><div><Clothing /></div> </MDBTabsPane>
        <MDBTabsPane open={basicActive === 'Sports & Outdoors'}><div><SportsandOutdoors/></div></MDBTabsPane>
      </MDBTabsContent>
    </>
  );
}
