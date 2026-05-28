export const handler = async (event: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Documents function placeholder — ready for business logic",
      input: event
    })
  };
};