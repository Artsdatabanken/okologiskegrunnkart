import React, { useEffect, useState } from "react";
import {
    IconButton,
    ListItem,
    ListItemText,
    LinearProgress,
    ListItemSecondaryAction
} from "@material-ui/core";
import { Refresh } from '@material-ui/icons'

const Høydeplott = ({ polyline, onRefresh }) => {
    const [url, setUrl] = useState({})
    const [progress, setProgress] = React.useState(null);
    useEffect(() => {
        const abortController = new AbortController();
        setProgress(0)
        setUrl({})
        if (polyline.coords.length < 2) {
            setProgress(null)
            return
        }
        var timer = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    clearInterval(timer);
                    return 100
                }
                return (prevProgress >= 100 ? 0 : (prevProgress || 0) + 1)
            });
        }, 100);
        const getImageUrl = async () => {
            const punkter = polyline.coords.map(p => p.coords.join(",")).join(',')
            const apiurl = "https://punkt.test.artsdatabanken.no/v1/hoydeprofil/diagram?punkter=" + punkter
            console.log("getting " + apiurl)

            try {
                const response = await fetch(apiurl, { signal: abortController.signal })
                const chartUrl = await response.json()
                if (chartUrl.error === "Maximum number of parallel running processes reached. Please try later.") {
                    chartUrl.error = "Overbelastning hos Kartverket."
                    chartUrl.canRetry = true
                }
                setUrl(chartUrl)
                console.log({ url })
                clearInterval(timer);
                setProgress(null)
            } catch (e) {
                if (!abortController.signal.aborted) setUrl({ error: e.message })
            }
        }
        getImageUrl()
        return () => {
            abortController.abort();
            setUrl({})
            clearInterval(timer);
        };
    }, [polyline.coords])

    //    if (url.error) return <Alert severity="error">{url.error}</Alert>
    var image =
        url.image && <span style={{ width: '100%', _height: 308 }}> <img style={{
            width: 470,
            mixBlendMode: "multiply",
            _position: "relative",
            marginLeft: -49, marginTop: -32,
            cursor: 'pointer'
        }}
            onClick={() => window.open(url.image)} src={url.image} />
        </span>
    const pb = progress && <LinearProgress style={{
        _marginLeft: -16, width: 376, zIndex: 999, _position:
            'relative', _left: 180, _top: 180
    }} variant="determinate" value={progress} />

    var primary = (pb ? "Lager høydeprofil..." : ((url.image || url.error) && "Høydeprofil"))
    var secondary = url.error && <span style={{ color: 'red' }}>{url.error}</span> || pb || image
    return (
        <ListItem button={url.image}>
            <ListItemText primary={primary} secondary={secondary} />
            {url.canRetry && <ListItemSecondaryAction onClick={onRefresh}><IconButton><Refresh /></IconButton></ListItemSecondaryAction>}
        </ListItem>
    );
};

export default Høydeplott;
