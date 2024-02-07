# Mutation operations tests

If you change the document used in tests (`TestDoc`), you will need to update the paths tested.
To do that without too much pain, follow this small guide.

## Replace and conquer

Create a new blank file.

### Expand properties

Copy/paste all properties of `RequiredPropertyTypes`.  
Select the freshly pasted text and use the replace function of your IDE to execute the following substitutions :

Search: `(\s*)(.*):(.*)\s`  
Replace 1 : `$1Optional$2:$3`  
Replace 2 : `$1ReadonlyProperty$2:$3`

Search : `(\s*)Array(.*):(.*)\s`  
Replace : `$1ReadonlyArray:$3`

### Format

Now with all your text selected :

Pattern: `^(\s*)(.*)Array(.*):(.*)\n`  
Replace (keep the empty lines) :

```
$1$2Array$3:$4
$1'$2Array$3[0]':$4
$1'$2Array$3[1]':$4
$1'$2Array$3[2]':$4
$1'$2Array$3[-1]':$4


```

Now you have all the paths to test.
