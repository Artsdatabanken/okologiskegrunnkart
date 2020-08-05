import React, { useEffect, useState } from "react";
import {
    CircularProgress
} from "@material-ui/core";
//import Alert from '@material-ui/lab/Alert';
import { Delete, Room as Marker, SettingsRemoteOutlined } from "@material-ui/icons";

const Høydeplott = ({ polyline }) => {
    const [url, setUrl] = useState({})
    const [progress, setProgress] = React.useState(null);
    useEffect(() => {
        setProgress(0)
        if (polyline.coords.length < 2) {
            setProgress(null)
            return
        }
        var timer = setInterval(() => {
            /*setProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    clearInterval(timer);
                    return 100
                }
                return (prevProgress >= 100 ? 0 : (prevProgress || 0) + 1)
            });*/
        }, 100);
        const getImageUrl = async () => {
            const punkter = polyline.coords.map(p => p.coords.join(",")).join(',')
            const apiurl = "https://punkt.test.artsdatabanken.no/v1/hoydeprofil/chart?punkter=" + punkter
            console.log(url)
            const response = await fetch(apiurl)
            const chartUrl = await response.json()
            setUrl(Object.assign(url, chartUrl))
            clearInterval(timer);
            setProgress(null)
        }

        getImageUrl()
        return () => {
            setUrl({ url: { image: url.image } })
            clearInterval(timer);
        };

    }, [polyline.coords])

    console.log({ url })
    //    if (url.error) return <Alert severity="error">{url.error}</Alert>
    return (
        <>
            {progress && <CircularProgress style={{ position: 'relative', left: 50, top: 50 }} variant="static" value={progress} />}
            {url.error && <div style={{ color: 'red', position: 'relative', left: 8, top: 100 }}>{url.error}</div>}

            <div style={{ width: '100%', height: 480 }}>{url.image && <img style={{
                width: 470,
                position: "relative",
                left: -29,
                cursor: 'pointer'
            }}
                onClick={() => window.open(url.image)} src={url.image} />
            }</div>
        </>
    );
};

export default Høydeplott;
