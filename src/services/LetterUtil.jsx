export const getSignature = (data, neededRole) => {
    return data?.signed_people?.filter((item) => item.role === neededRole)[0]?.signature ? data?.signed_people?.filter((item) => item.role === neededRole)[0]?.signature : null
}

export const getUserEvaluation = (data, neededRole) => {
    return data?.signed_people?.filter((item) => item.role === neededRole)[0]?.status ? data?.signed_people?.filter((item) => item.role === neededRole)[0]?.status : null
}