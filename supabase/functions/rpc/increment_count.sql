
CREATE OR REPLACE FUNCTION increment_count(table_name text, id_value uuid, column_name text)
RETURNS integer 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
DECLARE
  current_count integer;
  new_count integer;
BEGIN
  -- Dynamically build and execute query to get current count
  EXECUTE format('SELECT %I FROM %I WHERE id = $1', column_name, table_name)
  INTO current_count
  USING id_value;
  
  -- Calculate new count (handle NULL case)
  new_count := COALESCE(current_count, 0) + 1;
  
  -- Dynamically build and execute update query
  EXECUTE format('UPDATE %I SET %I = $1 WHERE id = $2', table_name, column_name)
  USING new_count, id_value;
  
  RETURN new_count;
END;
$$;
