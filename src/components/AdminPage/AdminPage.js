import React, { useState } from 'react';
import PageHeader from '../PageHeader/PageHeader';
import Footer from "../Footer/Footer";
import ClientsPage from './ClientsPage';
import DashboardPage from './DashboardPage';
import RealTimeDashboardPage from './RealTimeDashboardPage'; // Import the new Real-Time Dashboard component
import ProductsPage from './ProductsPage';
import OrdersPage from './OrdersPage';
import CategoriesPage from './CategoriesPage';

// Importer les composants de React Bootstrap
import { Container, Row, Col, Nav, Navbar } from 'react-bootstrap';

function Admin() {
  // Définir l'état pour l'onglet sélectionné
  const [selectedTab, setSelectedTab] = useState('clients');

  return (
    <div>
      <PageHeader />

      {/* Wrapper pour la page */}
      <Container fluid>
        <Row>
          {/* Barre latérale */}
          <Col xs={2} className="sidebar">
            <Navbar variant="dark" className="flex-column" style={{ backgroundColor: '#343a40' }}>
              <Nav className="flex-column">
                <Nav.Link
                  onClick={() => setSelectedTab('clients')}
                  style={{ color: selectedTab === 'clients' ? '#17a2b8' : 'white' }}
                >
                  Clients
                </Nav.Link>
                <Nav.Link
                  onClick={() => setSelectedTab('categories')}
                  style={{ color: selectedTab === 'categories' ? '#17a2b8' : 'white' }}
                >
                  Categories
                </Nav.Link>
                <Nav.Link
                  onClick={() => setSelectedTab('produits')}
                  style={{ color: selectedTab === 'produits' ? '#17a2b8' : 'white' }}
                >
                  Products
                </Nav.Link>
                <Nav.Link
                  onClick={() => setSelectedTab('commandes')}
                  style={{ color: selectedTab === 'commandes' ? '#17a2b8' : 'white' }}
                >
                  Orders
                </Nav.Link>
                <Nav.Link
                  onClick={() => setSelectedTab('dashboard')}
                  style={{ color: selectedTab === 'dashboard' ? '#17a2b8' : 'white' }}
                >
                  DashboardPage
                </Nav.Link>
                <Nav.Link
                  onClick={() => setSelectedTab('realTimeDashboard')}
                  style={{ color: selectedTab === 'realTimeDashboard' ? '#17a2b8' : 'white' }}
                >
                  Real-Time Dashboard
                </Nav.Link>
              </Nav>
            </Navbar>
          </Col>

          {/* Contenu principal */}
          <Col xs={10} className="main-content">
            <div style={{ padding: '20px', border: '2px dashed #ddd' }}>
              {/* Contenu dynamique selon l'onglet sélectionné */}
              {selectedTab === 'clients' && <ClientsPage />}
              {selectedTab === 'categories' && <CategoriesPage />}
              {selectedTab === 'produits' && <ProductsPage />}
              {selectedTab === 'commandes' && <OrdersPage />}
              {selectedTab === 'dashboard' && <DashboardPage />}
              {selectedTab === 'realTimeDashboard' && <RealTimeDashboardPage />}
            </div>
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
}

export default Admin;
