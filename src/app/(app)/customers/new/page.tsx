    const result = await createCustomerAction(data);
    setLoading(false);

    if (result.success && result.id) {
      toast({
        title: 'Customer Created',
        description: `Customer ${data.company} has been added successfully.`,
      });
      router.push(`/customers/${result.id}`);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Creating Customer',
        description: result.error,
      });
    }
