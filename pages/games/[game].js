import React, { useEffect } from "react";
import Layout from "../../components/layout";
import { GameType } from "../../interfaces/GameType";
import Head from 'next/head'

const stylesLoadingText = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: '1 1 auto'
}


const {
    REACT_APP_HANGMANGAME_HOST: HangManGameHostUrl,
    REACT_APP_TICTACTOEGAME_HOST: TicTacToeGameHostUrl
} = process.env;

async function getScriptURL(componentHostUrl) {
    const res = await fetch(`${componentHostUrl}/asset-manifest.json`)
    const manifest = await res.json();

    let styleUrl = `${componentHostUrl}${manifest.files["main.css"]}`;
    let scriptUrl = `${componentHostUrl}${manifest.files["main.js"]}`;

    return {
        styleUrl,
        scriptUrl
    }
}
export async function getStaticProps({ params }) {

    let gameTitle = "";
    let componentHostUrl = "";

    if (params.game === GameType.HangMan.name) {
        gameTitle = gameTitle;
        componentHostUrl = HangManGameHostUrl;
    }
    else {
        gameTitle = GameType.TicTacToe.title;
        componentHostUrl = TicTacToeGameHostUrl;
    }

    const urls = await getScriptURL(componentHostUrl)

    return {
        props: {
            gameName: params.game,
            gameTitle: gameTitle,
            componentHostUrl: componentHostUrl,
            ...urls
        }
    }
}

export async function getStaticPaths() {

    const paths = [
        {
            params: {
                game: GameType.HangMan.name,
            }
        },
        {
            params: {
                game: GameType.TicTacToe.name,
            }
        }
    ];

    console.log("paths: ", paths);

    return {
        paths,
        fallback: false
    }
}

const GameComponent = ({ gameName, gameTitle, componentHostUrl, styleUrl, scriptUrl }) => {
    const [showLoadingText, setShowLoadingText] = React.useState(true);

    useEffect(() => {

        const scriptId = `micro-frontend-script-${gameName}`;

        const renderMicroFrontend = () => {
            window[`render${gameName}`](`${gameName}-container`, null);
        };

        if (document.getElementById(scriptId)) {
            setShowLoadingText(false);
            renderMicroFrontend();
            return;
        }

        const style = document.createElement("link");
        style.href = styleUrl;
        style.rel = `stylesheet`;
        document.head.appendChild(style);

        const script = document.createElement("script");
        script.id = scriptId;
        script.crossOrigin = "";
        script.src = scriptUrl;
        script.onload = () => {
            setShowLoadingText(false);
            renderMicroFrontend();
        };
        document.head.appendChild(script);

        // const renderMicroFrontend = () => {
        //     window[`render${gameName}`](`${gameName}-container`, null);
        // };

        // if (document.getElementById(scriptId)) {
        //     setShowLoadingText(false);
        //     renderMicroFrontend();
        //     return;
        // }

        // fetch(`${componentHostUrl}/asset-manifest.json`)
        //     .then((res) => res.json())
        //     .then((manifest) => {
        //         const style = document.createElement("link");
        //         style.href = `${componentHostUrl}${manifest.files["main.css"]}`;
        //         style.rel = `stylesheet`;
        //         document.head.appendChild(style);

        //         const script = document.createElement("script");
        //         script.id = scriptId;
        //         script.crossOrigin = "";
        //         script.src = `${componentHostUrl}${manifest.files["main.js"]}`;
        //         script.onload = () => {
        //             setShowLoadingText(false);
        //             renderMicroFrontend();
        //         };
        //         document.head.appendChild(script);
        //     });

        return () => {
            window[`unmount${gameName}`] && window[`unmount${gameName}`](`${gameName}-container`);
        };
    });

    return (
        <Layout>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <title>{gameTitle}</title>
            </Head>
            {showLoadingText && <div style={stylesLoadingText}>Loading Game...</div>}
            <div className={'fullWidth'} id={`${gameName}-container`} />
        </Layout>
    );
}

export default GameComponent;