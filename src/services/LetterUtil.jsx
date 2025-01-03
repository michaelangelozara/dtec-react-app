export const getSignature = (data, neededRole) => {
    return data?.signed_people?.filter((item) => item.role === neededRole)[0]?.signature ? data?.signed_people?.filter((item) => item.role === neededRole)[0]?.signature : null
}