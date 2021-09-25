exports.timeFormat = (timeStr) => {
    if (!timeStr) return null;
    const temp = timeStr.split(',')[0].split('/');

    return temp[2] + '-' + ('00' + temp[0]).slice(-2) + '-' + ('00' + temp[1]).slice(-2);
}

exports.germanTimeFormat = (timeStr) => {
    if (!timeStr) return null;
    const date = new Date(new Date(timeStr).getTime() + 7200000);

    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const h = date.getHours();
    const mm = date.getMinutes();
    const s = date.getSeconds();

    return ('00' + d).slice(-2) + '.' + ('00' + m).slice(-2) + '.' + y + ',' + ('00' + h).slice(-2) + ':' + ('00' + mm).slice(-2) + ':' + ('00' + s).slice(-2);
}

exports.germanDateFormat = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);

    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();

    return ('00' + d).slice(-2) + '.' + ('00' + m).slice(-2) + '.' + y;
}
