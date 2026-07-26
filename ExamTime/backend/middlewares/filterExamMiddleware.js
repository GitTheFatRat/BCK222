const FIELDS_TO_STRIP = ['correctAnswer', 'explanation'];

function stripAnswerFields(data) {
    if (Array.isArray(data)) {
        return data.map(stripAnswerFields);
    }

    if (data !== null && typeof data === 'object') {
        const plainObject = typeof data.toObject === 'function' ? data.toObject() : data;
        const clone = { ...plainObject };

        for (const field of FIELDS_TO_STRIP) {
            delete clone[field];
        }

        for (const key of Object.keys(clone)) {
            clone[key] = stripAnswerFields(clone[key]);
        }

        return clone;
    }

    return data;
}

export function filterExamMiddleware(req, res, next) {
    const originalJson = res.json.bind(res);

    res.json = (payload) => {
        if (req.query.mode === 'exam') {
            return originalJson(stripAnswerFields(payload));
        }
        return originalJson(payload);
    };

    next();
}