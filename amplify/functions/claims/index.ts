export const handler = async (event: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Claims function placeholder — ready for business logic",
      input: event
    })
  };
};