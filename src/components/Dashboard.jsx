import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [activePage, setActivePage] = useState(null);

  const tiles = [
    { size: 'big', className: 'tile-1 slideTextUp', pageType: 'r-page', pageName: 'random-r-page', content: 'This tile\'s content slides up', footer: 'View all tasks' },
    { size: 'small', className: 'tile-2 slideTextRight', pageType: 's-page', pageName: 'random-restored-page', icon: 'icon-arrow-right', footer: 'Tile\'s content slides right. Page opens from left' },
    { size: 'small', className: 'tile-3', pageType: 'r-page', pageName: 'random-r-page', icon: 'icon-calendar-alt-fill' },
    { size: 'big', className: 'tile-4 fig-tile', pageType: 'r-page', pageName: 'random-r-page', image: 'https://sarasoueidan.com/demos/windows8-animations/images/blue.jpg', caption: 'Slide-out Caption from left' },
    { size: 'big', className: 'tile-5', pageType: 'r-page', pageName: 'random-r-page', icon: 'icon-cloudy', content: 'Weather' },
    { size: 'big', className: 'tile-6 slideTextLeft', pageType: 'r-page', pageName: 'random-r-page', icon: 'icon-skype', footer: 'Make a Call' },
    { size: 'small', className: 'tile-7 rotate3d rotate3dX', pageType: 'r-page', pageName: 'random-r-page', frontIcon: 'icon-picassa', backContent: 'Launch Picassa' },
    { size: 'small', className: 'tile-8 rotate3d rotate3dY', pageType: 'r-page', pageName: 'random-r-page', frontIcon: 'icon-instagram', backContent: 'Launch Instagram' },
    { size: '2xbig', className: 'tile-9 fig-tile', pageType: 'custom-page', pageName: 'random-r-page', image: 'https://sarasoueidan.com/demos/windows8-animations/images/summer.jpg', caption: 'Fixed Caption: Some Subtitle or Tile Description Goes Here with some kinda link or anything' },
    { size: 'big', className: 'tile-10', pageType: 's-page', pageName: 'custom-page', content: 'Windows-8-like Animations with CSS3 & jQuery © Sara Soueidan. Licensed under MIT.' },
  ];

  const handleTileClick = (pageType, pageName) => {
    setActivePage({ pageType, pageName });
  };

  const handleClose = () => {
    setActivePage(null);
  };

  const renderPage = () => {
    if (!activePage) return null;

    const pages = {
      'random-r-page': (
        <div className="page-content">
          <h2 className="page-title">App Screen</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
        </div>
      ),
      'random-restored-page': (
        <div className="page-content">
          <h2 className="page-title">Some minimized App</h2>
        </div>
      ),
      'custom-page': (
        <div className="page-content">
          <h2 className="page-title">Thank You!</h2>
        </div>
      ),
    };

    return (
      <div className={`page ${activePage.pageType} ${activePage.pageName}`}>
        {pages[activePage.pageName]}
        <div className={`close-button ${activePage.pageType}-close-button`} onClick={handleClose}>x</div>
      </div>
    );
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard clearfix">
        <ul className="tiles">
          <div className="col1 clearfix">
            {tiles.slice(0, 4).map((tile, index) => (
              <li key={index} className={`tile tile-${tile.size} ${tile.className}`} onClick={() => handleTileClick(tile.pageType, tile.pageName)}>
                {tile.image ? (
                  <figure>
                    <img src={tile.image} alt="" />
                    <figcaption className="tile-caption caption-left">{tile.caption}</figcaption>
                  </figure>
                ) : (
                  <div className="faces">
                    {tile.frontIcon && (
                      <div className="front">
                        <span className={tile.frontIcon}></span>
                      </div>
                    )}
                    {tile.backContent && (
                      <div className="back">
                        <p>{tile.backContent}</p>
                      </div>
                    )}
                    {tile.icon && <p className={tile.icon}></p>}
                    {tile.content && <p>{tile.content}</p>}
                    {tile.footer && <div>{tile.footer}</div>}
                  </div>
                )}
              </li>
            ))}
          </div>
          <div className="col2 clearfix">
            {tiles.slice(4, 8).map((tile, index) => (
              <li key={index} className={`tile tile-${tile.size} ${tile.className}`} onClick={() => handleTileClick(tile.pageType, tile.pageName)}>
                {tile.image ? (
                  <figure>
                    <img src={tile.image} alt="" />
                    <figcaption className="tile-caption caption-left">{tile.caption}</figcaption>
                  </figure>
                ) : (
                  <div className="faces">
                    {tile.frontIcon && (
                      <div className="front">
                        <span className={tile.frontIcon}></span>
                      </div>
                    )}
                    {tile.backContent && (
                      <div className="back">
                        <p>{tile.backContent}</p>
                      </div>
                    )}
                    {tile.icon && <p className={tile.icon}></p>}
                    {tile.content && <p>{tile.content}</p>}
                    {tile.footer && <div>{tile.footer}</div>}
                  </div>
                )}
              </li>
            ))}
          </div>
          <div className="col3 clearfix">
            {tiles.slice(8).map((tile, index) => (
              <li key={index} className={`tile tile-${tile.size} ${tile.className}`} onClick={() => handleTileClick(tile.pageType, tile.pageName)}>
                {tile.image ? (
                  <figure>
                    <img src={tile.image} alt="" />
                    <figcaption className="tile-caption caption-left">{tile.caption}</figcaption>
                  </figure>
                ) : (
                  <div className="faces">
                    {tile.frontIcon && (
                      <div className="front">
                        <span className={tile.frontIcon}></span>
                      </div>
                    )}
                    {tile.backContent && (
                      <div className="back">
                        <p>{tile.backContent}</p>
                      </div>
                    )}
                    {tile.icon && <p className={tile.icon}></p>}
                    {tile.content && <p>{tile.content}</p>}
                    {tile.footer && <div>{tile.footer}</div>}
                  </div>
                )}
              </li>
            ))}
          </div>
        </ul>
      </div>
      {renderPage()}
    </div>
  );
};

export default Dashboard;
